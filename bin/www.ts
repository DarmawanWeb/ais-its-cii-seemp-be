#!/usr/bin/env node

import app from '../src/app';
import http from 'http';
import logger from '../src/config/logger';
import { syncDatabase } from '../src/config/database';
import config from '../src/config/config';
import { connectSocket } from '../src/config/ws';
import socketServer from '../src/config/ws-server';

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
app.set('port', port);

syncDatabase();
connectSocket();
socketServer.listen(8082, () => {
      logger.info(
        `Socket.IO server is running on ws://localhost:${8081}`,
      );
});

const server = http.createServer(app);
server.listen(port);

server.on('error', onError);
server.on('listening', () => {
  const addr = server.address();
  const bind =
    typeof addr === 'string' ? 'pipe ' + addr : addr ? 'port ' + addr.port : '';
  logger.info('Listening on ' + bind);
});
