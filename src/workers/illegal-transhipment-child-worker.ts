import { IllegalTranshipmentQueueRepository } from '../repositories/illegal-transhipment/it-queue.repository';
import { IllegalTranshipmentResultRepository } from '../repositories/illegal-transhipment/it-result.repository';
import { AisRepository } from '../repositories/ais.repository';
import { detectIllegalTranshipment } from '../utils/illegal-transhipment';
import { syncDatabase } from '../config/database';
import logger from '../config/logger';

class ChildWorker {
  private queueRepository: IllegalTranshipmentQueueRepository;
  private resultRepository: IllegalTranshipmentResultRepository;
  private aisRepository: AisRepository;
  private isRunning: boolean = false;
  private processingCount: number = 0;

  constructor() {
    this.queueRepository = new IllegalTranshipmentQueueRepository();
    this.resultRepository = new IllegalTranshipmentResultRepository();
    this.aisRepository = new AisRepository();
  }

  async initialize() {
    try {
      await syncDatabase();
      logger.info('[Child Worker] Database connected');
      this.isRunning = true;
    } catch (error) {
      logger.error('[Child Worker] Failed to initialize:', error);
      throw error;
    }
  }

  async checkQueue(): Promise<number> {
    try {
      const queue = await this.queueRepository.getAllSorted();
      const pendingCount = queue.filter((item) => item.status === 'pending').length;
      return pendingCount;
    } catch (error) {
      logger.error('[Child Worker] Error checking queue:', error);
      return 0;
    }
  }

  async processOne(): Promise<{ processed: boolean; queueEmpty: boolean }> {
    if (!this.isRunning) {
      logger.warn('[Child Worker] Not running, skipping process');
      return { processed: false, queueEmpty: true };
    }

    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed / 1024 / 1024;

    try {
      this.processingCount++;

      const queue = await this.queueRepository.getAllSorted();

      if (queue.length === 0) {
        logger.debug('[Child Worker] Queue is empty');
        return { processed: false, queueEmpty: true };
      }

      const queueItem = queue.find((item) => item.status === 'pending');

      if (!queueItem) {
        logger.debug('[Child Worker] No pending items');
        return { processed: false, queueEmpty: true };
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
          logger.info(
            `[Child Worker] Skipping ${queueItem.ship1MMSI}-${queueItem.ship2MMSI}: Last detection was ${Math.round(timeSinceLastDetection / 1000 / 60)} minutes ago`,
          );
          await this.queueRepository.delete(
            queueItem.ship1MMSI,
            queueItem.ship2MMSI,
          );
          return { processed: true, queueEmpty: queue.length <= 1 };
        }
      }

      logger.info(
        `[Child Worker] Processing ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI} (Priority: ${queueItem.priority})`,
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
        logger.info(
          `[Child Worker] Insufficient data for ${queueItem.ship1MMSI}-${queueItem.ship2MMSI}`,
        );
        await this.queueRepository.delete(
          queueItem.ship1MMSI,
          queueItem.ship2MMSI,
        );
        
        return { processed: true, queueEmpty: queue.length <= 1 };
      }

      const maxRouteLength = 60;
      const limitedShip1Route = ship1Route.slice(-maxRouteLength);
      const limitedShip2Route = ship2Route.slice(-maxRouteLength);

      logger.info(
        `[Child Worker] Analyzing routes: Ship1(${limitedShip1Route.length} points), Ship2(${limitedShip2Route.length} points)`,
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
        logger.warn(
          `[Child Worker] ⚠️  ILLEGAL TRANSHIPMENT DETECTED! ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI}`,
        );
        logger.info(`  Accuracy: ${detectionResult.accuracy}%`);
        logger.info(`  Average Priority: ${detectionResult.averagePriority}`);
        logger.info(
          `  Distribution - High: ${detectionResult.priorityDistribution?.high}%, Medium: ${detectionResult.priorityDistribution?.medium}%, Low: ${detectionResult.priorityDistribution?.low}%`,
        );
      } else {
        logger.info(
          `[Child Worker] ✓ No illegal activity detected for ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI}`,
        );
      }

      await this.queueRepository.delete(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
      );

      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      const memoryUsed = (endMemory - startMemory).toFixed(2);

      logger.info(
        `[Child Worker] Processing completed in ${duration}s, Memory used: ${memoryUsed}MB`,
      );

      const remainingQueue = queue.length - 1;

      if (global.gc) {
        global.gc();
      }

      return { processed: true, queueEmpty: remainingQueue === 0 };
    } catch (error) {
      logger.error('[Child Worker] Error processing queue item:', error);

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
        logger.error(
          '[Child Worker] Error cleaning up failed item:',
          cleanupError,
        );
      }

      return { processed: false, queueEmpty: false };
    }
  }

  stop() {
    this.isRunning = false;
    logger.info('[Child Worker] Stopped');
  }

  getStats() {
    const memUsage = process.memoryUsage();
    return {
      processingCount: this.processingCount,
      isRunning: this.isRunning,
      memoryUsage: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      },
    };
  }
}

const worker = new ChildWorker();

process.on('message', async (msg) => {
  try {
    if (msg === 'process') {
      const result = await worker.processOne();
      if (process.send) {
        process.send({
          type: 'result',
          processed: result.processed,
          queueEmpty: result.queueEmpty,
          stats: worker.getStats(),
        });
      }
    } else if (msg === 'checkQueue') {
      const count = await worker.checkQueue();
      if (process.send) {
        process.send({
          type: 'queueStatus',
          count: count,
          isEmpty: count === 0,
        });
      }
    } else if (msg === 'stop') {
      worker.stop();
      setTimeout(() => {
        process.exit(0);
      }, 1000);
    } else if (msg === 'stats') {
      if (process.send) {
        process.send({
          type: 'stats',
          stats: worker.getStats(),
        });
      }
    }
  } catch (error) {
    logger.error('[Child Worker] Error handling message:', error);
    if (process.send) {
      process.send({
        type: 'error',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
});

(async () => {
  try {
    await worker.initialize();
    logger.info('[Child Worker] Initialized and ready');
    if (process.send) {
      process.send({ type: 'ready' });
    }
  } catch (error) {
    logger.error('[Child Worker] Failed to initialize:', error);
    process.exit(1);
  }
})();

process.on('SIGTERM', () => {
  logger.info('[Child Worker] SIGTERM received');
  worker.stop();
  setTimeout(() => process.exit(0), 1000);
});

process.on('SIGINT', () => {
  logger.info('[Child Worker] SIGINT received');
  worker.stop();
  setTimeout(() => process.exit(0), 1000);
});

process.on('uncaughtException', (error) => {
  logger.error('[Child Worker] Uncaught exception:', error);
  worker.stop();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    '[Child Worker] Unhandled rejection at:',
    promise,
    'reason:',
    reason,
  );
  worker.stop();
  process.exit(1);
});