// src/workers/illegal-transhipment-child-worker.ts
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

  async processOne(): Promise<boolean> {
    if (!this.isRunning) {
      logger.warn('[Child Worker] Not running, skipping process');
      return false;
    }

    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed / 1024 / 1024;

    try {
      this.processingCount++;
      logger.info(
        `[Child Worker] Processing item #${this.processingCount}`,
      );

      const queue = await this.queueRepository.getAllSorted();

      if (queue.length === 0) {
        logger.debug('[Child Worker] Queue is empty');
        return false;
      }

      const queueItem = queue.find((item) => item.status === 'pending');

      if (!queueItem) {
        logger.debug('[Child Worker] No pending items');
        return false;
      }

      // Check last detection
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
          return true;
        }
      }

      logger.info(
        `[Child Worker] Processing ${queueItem.ship1MMSI} - ${queueItem.ship2MMSI} (Priority: ${queueItem.priority})`,
      );

      // Update status to in_progress
      await this.queueRepository.updateStatus(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
        'in_progress',
      );

      // Get ship routes
      const ship1Route = await this.aisRepository.getShipRouteByMMSI(
        queueItem.ship1MMSI,
        60 * 60 * 1000, // Last 1 hour
      );

      const ship2Route = await this.aisRepository.getShipRouteByMMSI(
        queueItem.ship2MMSI,
        60 * 60 * 1000,
      );

      // Validate routes
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
        return true;
      }

      // Limit data to prevent memory issues
      const maxRouteLength = 60;
      const limitedShip1Route = ship1Route.slice(-maxRouteLength);
      const limitedShip2Route = ship2Route.slice(-maxRouteLength);

      logger.info(
        `[Child Worker] Analyzing routes: Ship1(${limitedShip1Route.length} points), Ship2(${limitedShip2Route.length} points)`,
      );

      // Detect illegal transhipment
      const detectionResult = await detectIllegalTranshipment(
        limitedShip1Route,
        limitedShip2Route,
        30 * 60 * 1000, // 30 minutes window
      );

      // Save result
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

      // Log result
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

      // Clean up queue
      await this.queueRepository.delete(
        queueItem.ship1MMSI,
        queueItem.ship2MMSI,
      );

      // Log performance
      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      const memoryUsed = (endMemory - startMemory).toFixed(2);

      logger.info(
        `[Child Worker] Processing completed in ${duration}s, Memory used: ${memoryUsed}MB`,
      );

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      return true;
    } catch (error) {
      logger.error('[Child Worker] Error processing queue item:', error);

      // Try to mark as failed
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
        logger.error('[Child Worker] Error cleaning up failed item:', cleanupError);
      }

      return false;
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
      },
    };
  }
}

// ==================== Main Execution ====================

const worker = new ChildWorker();

// Handle messages from parent
process.on('message', async (msg) => {
  try {
    if (msg === 'process') {
      const result = await worker.processOne();
      if (process.send) {
        process.send({ 
          type: 'result', 
          processed: result,
          stats: worker.getStats()
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
          stats: worker.getStats() 
        });
      }
    }
  } catch (error) {
    logger.error('[Child Worker] Error handling message:', error);
    if (process.send) {
      process.send({ 
        type: 'error', 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
});

// Initialize worker
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

// Handle shutdown signals
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
  logger.error('[Child Worker] Unhandled rejection at:', promise, 'reason:', reason);
  worker.stop();
  process.exit(1);
});