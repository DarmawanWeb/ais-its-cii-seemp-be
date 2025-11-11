#!/usr/bin/env node

import app from '../src/app';
import http from 'http';
import logger from '../src/config/logger';
import { syncDatabase } from '../src/config/database';
import config from '../src/config/config';
import { connectSocket } from '../src/config/ws';
import socketServer from '../src/config/ws-server';
import {batamConnectSocket} from '../src/config/ws-batam'

const normalizePort = (val: number): number | boolean => {
  if (isNaN(val)) return false;
  if (val >= 0) return val;
  return false;
};

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

logger.info('Starting server...');

const port = normalizePort(config.server.port || 3003);
const wsServerPort = normalizePort(config.websocket.serverPort || 3004);
app.set('port', port);
socketServer.listen(wsServerPort);

syncDatabase();
connectSocket();
batamConnectSocket();

const server = http.createServer(app);
server.listen(port);

server.on('error', onError);
server.on('listening', async () => {
  const addr = server.address();
  const bind =
    typeof addr === 'string' ? 'pipe ' + addr : addr ? 'port ' + addr.port : '';
  logger.info('Listening on ' + bind);
  logger.info('Worker disabled - running in separate process');
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

setInterval(() => {
  const usage = process.memoryUsage();
  logger.info(`[API] Memory usage: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
}, 60000);