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
  private maxConsecutiveErrors: number = 5; // TAMBAHKAN INI
  private consecutiveErrors: number = 0; // TAMBAHKAN INI
  private maxMemoryUsage: number = 3000; // MB - TAMBAHKAN INI

  constructor() {
    this.queueRepository = new IllegalTranshipmentQueueRepository();
    this.resultRepository = new IllegalTranshipmentResultRepository();
    this.aisRepository = new AisRepository();
  }

  // TAMBAHKAN METHOD INI
  private checkMemoryUsage(): void {
    const usage = process.memoryUsage();
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
    
    console.log(`[Worker] Memory usage: ${usedMB}MB / ${this.maxMemoryUsage}MB`);
    
    if (usedMB > this.maxMemoryUsage) {
      console.warn('[Worker] Memory usage exceeded limit, forcing garbage collection');
      if (global.gc) {
        global.gc();
      }
      
      // Jika masih tinggi setelah GC, stop worker
      const afterGC = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
      if (afterGC > this.maxMemoryUsage) {
        console.error('[Worker] Memory usage still high after GC, stopping worker');
        this.stop();
      }
    }
  }

  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        // Check memory sebelum processing
        this.checkMemoryUsage();
        
        const hasProcessed = await this.processNextInQueue();

        if (hasProcessed) {
          this.consecutiveErrors = 0; // Reset error counter on success
          await this.sleep(this.processingDelay);
        } else {
          await this.sleep(this.idleDelay);
        }

        // Force GC periodically
        if (global.gc) {
          global.gc();
        }
      } catch (error) {
        this.consecutiveErrors++;
        console.error(`[Worker] Error in main loop (${this.consecutiveErrors}/${this.maxConsecutiveErrors}):`, error);
        
        // Stop worker jika terlalu banyak error berturut-turut
        if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
          console.error('[Worker] Too many consecutive errors, stopping worker');
          this.stop();
          break;
        }
        
        await this.sleep(10000);
      }
    }
    
    console.log('[Worker] Process loop ended');
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

      // Check memory before heavy processing
      const beforeMemory = process.memoryUsage().heapUsed / 1024 / 1024;

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

      // BATASI JUMLAH DATA YANG DIPROSES
      const maxRouteLength = 60; // Max 60 data points per ship
      const limitedShip1Route = ship1Route.slice(-maxRouteLength);
      const limitedShip2Route = ship2Route.slice(-maxRouteLength);

      console.log(
        `[Worker] Analyzing routes: Ship1(${limitedShip1Route.length} points), Ship2(${limitedShip2Route.length} points)`,
      );

      const detectionResult = await detectIllegalTranshipment(
        limitedShip1Route,
        limitedShip2Route,
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
          `[Worker] ⚠️  ILLEGAL TRANSHIPMENT DETECTED! ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI}`,
        );
        console.log(`  Accuracy: ${detectionResult.accuracy}%`);
        console.log(`  Average Priority: ${detectionResult.averagePriority}`);
        console.log(
          `  Distribution - High: ${detectionResult.priorityDistribution?.high}%, Medium: ${detectionResult.priorityDistribution?.medium}%, Low: ${detectionResult.priorityDistribution?.low}%`,
        );
      } else {
        console.log(
          `[Worker] ✓ No illegal activity detected for ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI}`,
        );
      }

      await this.queueRepository.delete(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
      );

      // Log memory usage after processing
      const afterMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const memoryDiff = afterMemory - beforeMemory;
      console.log(`[Worker] Memory used for this processing: ${memoryDiff.toFixed(2)}MB`);

      return true;
    } catch (error) {
      console.error('[Worker] Error processing queue item:', error);
      
      // Mark as failed instead of pending to prevent infinite loop
      try {
        const queue = await this.queueRepository.getAllSorted();
        const failedItem = queue.find((item) => item.status === 'in_progress');
        if (failedItem) {
          await this.queueRepository.updateStatus(
            failedItem.ship1MMSI,
            failedItem.ship2MMSI,
            'failed',
          );
        }
      } catch (cleanupError) {
        console.error('[Worker] Error cleaning up failed item:', cleanupError);
      }
      
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[Worker] Already running');
      return;
    }

    this.isRunning = true;
    this.consecutiveErrors = 0;
    console.log('[Worker] Illegal transhipment worker started');

    this.processLoop();
  }

  stop(): void {
    console.log('[Worker] Stopping worker...');
    this.isRunning = false;
  }
}