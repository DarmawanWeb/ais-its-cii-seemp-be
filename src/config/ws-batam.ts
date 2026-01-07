import { io, Socket } from 'socket.io-client';
import config from './config';
import logger from './logger';
import type { TimestampedAisMessage } from '../types/ais.type';
import { AisService } from '../services/ais.service';

const aisService = new AisService();
const batamConnectSocket = () => {
  const socket: Socket = io(config.websocket.batam_url, {
    auth: {
      token: config.websocket.token,
    },
    transports: ['websocket'],
    withCredentials: true,
  });

  socket.on('connect', () => {
    logger.info(`Batam webSocket connection established with ID: ${socket.id}`);
  });

  socket.on('messageFromServer', async (data: TimestampedAisMessage) => {
    try {
      await aisService.createOrUpdateAis(data, true);
      console.log('Batam AIS data processed for MMSI:', data.message.data.mmsi);
    } catch (error) {
      logger.error('Error processing message from server:', error);
      console.error('Error processing message from server:', data);
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

export { batamConnectSocket };
