import { IllegalTranshipmentQueueRepository } from '../../repositories/illegal-transhipment/it-queue.repository';
import { IllegalTranshipmentResultRepository } from '../../repositories/illegal-transhipment/it-result.repository';
import { AisRepository } from '../../repositories/ais.repository';
import { detectIllegalTranshipment } from '../../utils/illegal-transhipment';

export class IllegalTranshipmentWorker {
  private queueRepository: IllegalTranshipmentQueueRepository;
  private resultRepository: IllegalTranshipmentResultRepository;
  private aisRepository: AisRepository;
  private isRunning: boolean = false;
  private processingDelay: number = 5000;
  private idleDelay: number = 30000;

  constructor() {
    this.queueRepository = new IllegalTranshipmentQueueRepository();
    this.resultRepository = new IllegalTranshipmentResultRepository();
    this.aisRepository = new AisRepository();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[Worker] Already running');
      return;
    }

    this.isRunning = true;
    console.log('[Worker] Illegal transhipment worker started');

    this.processLoop();
  }

  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        const hasProcessed = await this.processNextInQueue();

        if (hasProcessed) {
          await this.sleep(this.processingDelay);
        } else {
          await this.sleep(this.idleDelay);
        }

        if (global.gc) {
          global.gc();
        }
      } catch (error) {
        console.error('[Worker] Error in main loop:', error);
        await this.sleep(10000);
      }
    }
  }

  stop(): void {
    console.log('[Worker] Stopping worker...');
    this.isRunning = false;
  }

  private async processNextInQueue(): Promise<boolean> {
    try {
      const queue = await this.queueRepository.getAllSorted();

      if (queue.length === 0) {
        return false;
      }

      const queueItem = queue.find((item) => item.status === 'pending');

      if (!queueItem) {
        return false;
      }

      const lastDetection = await this.resultRepository.getLastDetection(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
      );

      if (lastDetection) {
        const timeSinceLastDetection =
          Date.now() - new Date(lastDetection.detectedAt).getTime();
        const fifteenMinutes = 15 * 60 * 1000;

        if (timeSinceLastDetection < fifteenMinutes) {
          console.log(
            `[Worker] Skipping ${queueItem.ship1MMSI}-${queueItem.ship2MMSI}: Last detection was ${Math.round(timeSinceLastDetection / 1000 / 60)} minutes ago`,
          );
          await this.queueRepository.delete(
            queueItem.ship1MMSI,
            queueItem.ship2MMSI,
          );
          return true;
        }
      }

      console.log(
        `[Worker] Processing ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI} (Priority: ${queueItem.priority})`,
      );

      await this.queueRepository.updateStatus(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
        'in_progress',
      );

      const ship1Route = await this.aisRepository.getShipRouteByMMSI(
        queueItem.ship1MMSI,
        60 * 60 * 1000,
      );

      const ship2Route = await this.aisRepository.getShipRouteByMMSI(
        queueItem.ship2MMSI,
        60 * 60 * 1000,
      );

      if (
        !ship1Route ||
        ship1Route.length === 0 ||
        !ship2Route ||
        ship2Route.length === 0
      ) {
        console.log(
          `[Worker] Insufficient data for ${queueItem.ship1MMSI}-${queueItem.ship2MMSI}`,
        );
        await this.queueRepository.delete(
          queueItem.ship1MMSI,
          queueItem.ship2MMSI,
        );
        return true;
      }

      console.log(
        `[Worker] Analyzing routes: Ship1(${ship1Route.length} points), Ship2(${ship2Route.length} points)`,
      );

      const detectionResult = await detectIllegalTranshipment(
        ship1Route,
        ship2Route,
        30 * 60 * 1000,
      );

     await this.resultRepository.create(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
        detectionResult.isIllegal,
        detectionResult.startTimestamp,
        detectionResult.endTimestamp,
        detectionResult.accuracy,
        detectionResult.averagePriority,
        detectionResult.priorityDistribution,
      );

      if (detectionResult.isIllegal) {
        console.log(
          `[Worker] ⚠️  ILLEGAL TRANSHIPMENT DETECTED! ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI}`
        );
        console.log(`  Accuracy: ${detectionResult.accuracy}%`);
        console.log(`  Average Priority: ${detectionResult.averagePriority}`);
        console.log(`  Distribution - High: ${detectionResult.priorityDistribution?.high}%, Medium: ${detectionResult.priorityDistribution?.medium}%, Low: ${detectionResult.priorityDistribution?.low}%`);
      } else {
        console.log(
          `[Worker] ✓ No illegal activity detected for ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI}`
        );
      }

      await this.queueRepository.delete(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
      );

      return true;
    } catch (error) {
      console.error('[Worker] Error processing queue item:', error);
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
