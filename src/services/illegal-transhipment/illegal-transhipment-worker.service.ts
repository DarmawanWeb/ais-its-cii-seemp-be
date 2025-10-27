import { fork, ChildProcess } from 'child_process';
import path from 'path';
import logger from '../../config/logger';

interface ChildMessage {
  type: 'ready' | 'result' | 'error' | 'stats' | 'queueStatus';
  processed?: boolean;
  queueEmpty?: boolean;
  count?: number;
  isEmpty?: boolean;
  stats?: WorkerStats;
  error?: string;
}

interface WorkerStats {
  processingCount: number;
  isRunning: boolean;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
}

export class IllegalTranshipmentWorker {
  private childProcess: ChildProcess | null = null;
  private isRunning: boolean = false;
  private processingDelay: number = 2000;
  private idleDelay: number = 60000;
  private emptyQueueDelay: number = 120000;
  private isProcessing: boolean = false;
  private consecutiveErrors: number = 0;
  private maxConsecutiveErrors: number = 5;
  private processedCount: number = 0;
  private restartAttempts: number = 0;
  private maxRestartAttempts: number = 3;
  private lastStatsUpdate: Date = new Date();
  private queueCheckPending: boolean = false;

  constructor() {}

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.info('[Worker] Already running');
      return;
    }

    this.isRunning = true;
    this.consecutiveErrors = 0;
    this.restartAttempts = 0;

    logger.info('[Worker] Starting illegal transhipment worker');

    await this.spawnChildProcess();
    this.processLoop();
  }

  private async spawnChildProcess(): Promise<void> {
    try {
      const workerPath = path.join(
        __dirname,
        '../../workers/illegal-transhipment-child-worker.js',
      );

      logger.info(`[Worker] Spawning child process: ${workerPath}`);

      this.childProcess = fork(workerPath, [], {
        execArgv: ['--max-old-space-size=1024', '--expose-gc'],
        env: {
          ...process.env,
          NODE_ENV: process.env.NODE_ENV || 'production',
        },
      });

      this.childProcess.on('message', (msg: ChildMessage) => {
        this.handleChildMessage(msg);
      });

      this.childProcess.on('error', (error) => {
        logger.error('[Worker] Child process error:', error);
        this.handleChildError();
      });

      this.childProcess.on('exit', (code, signal) => {
        logger.warn(
          `[Worker] Child process exited with code ${code}, signal ${signal}`,
        );

        if (this.isRunning) {
          this.handleChildExit();
        }
      });

      await this.waitForReady();

      logger.info('[Worker] Child process spawned and ready');
      this.restartAttempts = 0;
    } catch (error) {
      logger.error('[Worker] Failed to spawn child process:', error);
      throw error;
    }
  }

  private waitForReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Child process ready timeout'));
      }, 30000);

      const handler = (msg: ChildMessage) => {
        if (msg.type === 'ready') {
          clearTimeout(timeout);
          this.childProcess?.removeListener('message', handler);
          resolve();
        }
      };

      this.childProcess?.on('message', handler);
    });
  }

  private handleChildMessage(msg: ChildMessage) {
    switch (msg.type) {
      case 'result':
        this.isProcessing = false;
        this.consecutiveErrors = 0;

        if (msg.processed) {
          this.processedCount++;
          logger.info(
            `[Worker] Item processed successfully (Total: ${this.processedCount})`,
          );
        } else {
          logger.debug('[Worker] No items to process');
        }

        if (msg.stats) {
          this.logChildStats(msg.stats);
        }
        break;

      case 'queueStatus':
        this.queueCheckPending = false;

        if (msg.isEmpty) {
          logger.debug('[Worker] Queue is empty, entering idle mode');
        } else {
          logger.debug(`[Worker] Queue has ${msg.count} pending items`);
        }
        break;

      case 'error':
        this.isProcessing = false;
        this.consecutiveErrors++;
        logger.error(
          `[Worker] Child process error (${this.consecutiveErrors}/${this.maxConsecutiveErrors}):`,
          msg.error,
        );

        if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
          logger.error('[Worker] Too many consecutive errors, stopping worker');
          this.stop();
        }
        break;

      case 'stats':
        if (msg.stats) {
          this.logChildStats(msg.stats);
        }
        break;

      default:
        logger.debug('[Worker] Unknown message type:', msg.type);
    }
  }

  private handleChildError() {
    this.isProcessing = false;
    this.consecutiveErrors++;

    if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
      logger.error('[Worker] Too many consecutive errors, stopping worker');
      this.stop();
    }
  }

  private async handleChildExit() {
    this.isProcessing = false;
    this.childProcess = null;

    if (!this.isRunning) {
      return;
    }

    this.restartAttempts++;

    if (this.restartAttempts >= this.maxRestartAttempts) {
      logger.error('[Worker] Max restart attempts reached, stopping worker');
      this.stop();
      return;
    }

    logger.info(
      `[Worker] Attempting to restart child process (${this.restartAttempts}/${this.maxRestartAttempts})`,
    );

    setTimeout(async () => {
      if (this.isRunning) {
        try {
          await this.spawnChildProcess();
          logger.info('[Worker] Child process restarted successfully');
        } catch (error) {
          logger.error('[Worker] Failed to restart child process:', error);
          this.handleChildExit();
        }
      }
    }, 5000);
  }

  private logChildStats(stats: WorkerStats) {
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - this.lastStatsUpdate.getTime();

    if (timeSinceLastUpdate > 60000) {
      logger.info('[Worker] Child process stats:', {
        processingCount: stats.processingCount,
        isRunning: stats.isRunning,
        memoryUsage: `${stats.memoryUsage.heapUsed}MB / ${stats.memoryUsage.heapTotal}MB`,
      });
      this.lastStatsUpdate = now;
    }
  }

  private async checkQueueAndProcess(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.childProcess || this.childProcess.killed) {
        resolve(false);
        return;
      }

      this.queueCheckPending = true;

      const timeout = setTimeout(() => {
        this.queueCheckPending = false;
        resolve(false);
      }, 5000);

      const handler = (msg: ChildMessage) => {
        if (msg.type === 'queueStatus') {
          clearTimeout(timeout);
          this.childProcess?.removeListener('message', handler);
          this.queueCheckPending = false;
          resolve(!msg.isEmpty);
        }
      };

      this.childProcess.on('message', handler);
      this.childProcess.send('checkQueue');
    });
  }

  private async processLoop(): Promise<void> {
    logger.info('[Worker] Process loop started');

    while (this.isRunning) {
      try {
        if (!this.childProcess || this.childProcess.killed) {
          logger.warn('[Worker] Child process not available, waiting...');
          await this.sleep(this.idleDelay);
          continue;
        }

        if (this.isProcessing || this.queueCheckPending) {
          await this.sleep(1000);
          continue;
        }

        const hasQueue = await this.checkQueueAndProcess();

        if (!hasQueue) {
          logger.debug('[Worker] No queue items, sleeping for 2 minutes');
          await this.sleep(this.emptyQueueDelay);
          continue;
        }

        logger.debug('[Worker] Queue has items, processing...');
        this.isProcessing = true;
        this.childProcess.send('process');

        await this.sleep(this.processingDelay);

        if (this.isProcessing) {
          logger.debug('[Worker] Processing completed, checking queue again');
          this.isProcessing = false;
        }

        this.logMainProcessStats();

        if (new Date().getTime() - this.lastStatsUpdate.getTime() > 300000) {
          this.childProcess.send('stats');
        }
      } catch (error) {
        logger.error('[Worker] Error in main loop:', error);
        this.isProcessing = false;
        this.queueCheckPending = false;
        await this.sleep(10000);
      }
    }

    logger.info('[Worker] Process loop ended');
  }

  private logMainProcessStats() {
    const usage = process.memoryUsage();
    const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
    const heapUsagePercent = ((usage.heapUsed / usage.heapTotal) * 100).toFixed(
      2,
    );

    if (heapUsedMB > 1500) {
      logger.warn(
        `[Worker] Main process high memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${heapUsagePercent}%)`,
      );

      if (global.gc) {
        logger.info('[Worker] Forcing garbage collection');
        global.gc();
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  stop(): void {
    logger.info('[Worker] Stopping worker...');
    this.isRunning = false;

    if (this.childProcess && !this.childProcess.killed) {
      logger.info('[Worker] Sending stop signal to child process');
      this.childProcess.send('stop');

      setTimeout(() => {
        if (this.childProcess && !this.childProcess.killed) {
          logger.warn('[Worker] Force killing child process');
          this.childProcess.kill('SIGKILL');
          this.childProcess = null;
        }
      }, 10000);
    }

    logger.info(
      `[Worker] Stopped. Total items processed: ${this.processedCount}`,
    );
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      isProcessing: this.isProcessing,
      processedCount: this.processedCount,
      consecutiveErrors: this.consecutiveErrors,
      restartAttempts: this.restartAttempts,
      childProcessAlive: this.childProcess && !this.childProcess.killed,
    };
  }
}
