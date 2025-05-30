import { io, Socket } from 'socket.io-client';
import config from './config';
import logger from './logger';
import type { TimestampedMessage } from '../types/ais.type';

const connectSocket = () => {
  const socket: Socket = io(config.websocket.url, {
    auth: {
      token: config.websocket.token,
    },
    transports: ['websocket'],
    withCredentials: true,
  });

  socket.on('connect', () => {
    logger.info(`WebSocket connection established with ID: ${socket.id}`);
  });

  socket.on('messageFromServer', (data: TimestampedMessage) => {
    handleAisDataController(data);
  });

  socket.on('connect_error', (err: Error) => {
    logger.error('Connection error:', err.message || err.stack);
  });

  socket.on('disconnect', () => {
    logger.info('WebSocket connection closed');
  });
};

const handleAisDataController = (data: TimestampedMessage) => {
  console.log('Received data:', data.message.data?.mmsi);
};

export { connectSocket };
