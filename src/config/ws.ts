import { io, Socket } from 'socket.io-client';
import config from './config';
import logger from './logger';
import type { TimestampedAisMessage } from '../types/ais.type';
import { AisService } from '../services/ais.service';

const aisService = new AisService();
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

  socket.on('messageFromServer', async (data: TimestampedAisMessage) => {
    try {
      console.log('Received message from server:', data);
      if (!data || !data.message || !data.timestamp) {
        console.log('Invalid data received from server:', data);
        return;
      }
      await aisService.createOrUpdateAis(data);
    } catch (error) {
      logger.error('Error processing message from server:', error);
      return;
    }
  });

  socket.on('connect_error', (err: Error) => {
    logger.error('Connection error:', err.message || err.stack);
  });

  socket.on('disconnect', () => {
    logger.info('WebSocket connection closed');
  });
};

export { connectSocket };
