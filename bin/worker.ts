#!/usr/bin/env node

import logger from '../src/config/logger';
import { syncDatabase } from '../src/config/database';
import { IllegalTranshipmentWorker } from '../src/services/illegal-transhipment/illegal-transhipment-worker.service';

let worker: IllegalTranshipmentWorker;

async function startWorker() {
  try {
    logger.info('[Worker] Starting illegal transhipment worker...');
    
    await syncDatabase();
    logger.info('[Worker] Database connected');

    worker = new IllegalTranshipmentWorker();
    await worker.start();
    
    logger.info('[Worker] Illegal transhipment worker started successfully');
  } catch (error) {
    logger.error('[Worker] Failed to start:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  logger.info('[Worker] SIGTERM received, shutting down gracefully');
  if (worker) {
    worker.stop();
  }
  setTimeout(() => {
    logger.info('[Worker] Process terminated');
    process.exit(0);
  }, 2000);
});

process.on('SIGINT', () => {
  logger.info('[Worker] SIGINT received, shutting down gracefully');
  if (worker) {
    worker.stop();
  }
  setTimeout(() => {
    logger.info('[Worker] Process terminated');
    process.exit(0);
  }, 2000);
});

process.on('uncaughtException', (error) => {
  logger.error('[Worker] Uncaught Exception:', error);
  if (worker) {
    worker.stop();
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('[Worker] Unhandled Rejection at:', promise, 'reason:', reason);
});

setInterval(() => {
  const usage = process.memoryUsage();
  logger.info(`[Worker] Memory usage: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
}, 60000);

startWorker();