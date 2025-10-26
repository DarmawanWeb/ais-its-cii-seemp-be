import http from 'node:http';
import { Server } from 'socket.io';
import logger from './logger';

import type { TimestampedAisMessage } from '../types/ais.type';
import { AisService } from '../services/ais.service';

const aisService = new AisService();
const socketServer = http.createServer();

const io = new Server(socketServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (room: string) => {
    logger.debug(`Socket ${socket.id} joined room: ${room}`);
    socket.join(room);
  });

  socket.on('ais:data', async (data: TimestampedAisMessage) => {
    try {
      if (!data || !data.message || !data.timestamp) {
        return;
      }

      console.log('Received AIS data:', data);

      await aisService.createOrUpdateAis(data);
    } catch (error) {
      logger.error('Error processing message from server:', error);
      console.error('Error processing message from server:', data);
      return;
    }
  });

  socket.on('error', (error: Error) => {
    logger.error('Socket error', error.message);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket ${socket.id} disconnected`);
  });
});

export default socketServer;
