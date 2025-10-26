import { IllegalTranshipmentQueueRepository } from '../../repositories/illegal-transhipment/it-queue.repository';
import { IllegalTranshipmentResultRepository } from '../../repositories/illegal-transhipment/it-result.repository';
import { AisRepository } from '../../repositories/ais.repository';
import { detectIllegalTranshipment } from '../../utils/illegal-transhipment';

export class IllegalTranshipmentDetectionService {
  private queueRepository: IllegalTranshipmentQueueRepository;
  private resultRepository: IllegalTranshipmentResultRepository;
  private aisRepository: AisRepository;

  constructor() {
    this.queueRepository = new IllegalTranshipmentQueueRepository();
    this.resultRepository = new IllegalTranshipmentResultRepository();
    this.aisRepository = new AisRepository();
  }

  async processQueue(): Promise<void> {
    const queue = await this.queueRepository.getAllSorted();

    for (const queueItem of queue) {
      if (queueItem.status !== 'pending') {
        continue;
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
          continue;
        }
      }

      try {
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
          await this.queueRepository.delete(
            queueItem.ship1MMSI,
            queueItem.ship2MMSI,
          );
          continue;
        }

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
        );

        await this.queueRepository.delete(
          queueItem.ship1MMSI,
          queueItem.ship2MMSI,
        );
      } catch (error) {
        console.error(
          `Error processing queue item for ships ${queueItem.ship1MMSI} and ${queueItem.ship2MMSI}:`,
          error,
        );
        await this.queueRepository.delete(
          queueItem.ship1MMSI,
          queueItem.ship2MMSI,
        );
      }
    }
  }

  async getIllegalTranshipmentResults() {
    return await this.resultRepository.getAllIllegalResults();
  }

  async getResultsByShip(mmsi: string) {
    return await this.resultRepository.getResultsByMMSI(mmsi);
  }
}
