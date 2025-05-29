import http from 'http';
import { Server } from 'socket.io';
import logger from './logger';

const socketServer = http.createServer();
const io = new Server(socketServer);

io.on('connection', (socket) => {
  logger.info('A user connected to WebSocket');
  socket.emit('welcome', 'Welcome to the Socket.IO server on port 8081!');

  socket.on('message', (msg: string) => {
    logger.debug(`Received message: ${msg}`);
    socket.emit('message', `Echo: ${msg}`);
  });

  socket.on('disconnect', () => {
    logger.info('A user disconnected from WebSocket');
  });
});

export default socketServer;
