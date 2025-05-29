#!/usr/bin/env node

import app from "../src/app";
import http from "http";
import logger from "../src/config/logger";
import { syncDatabase } from "../src/config/database";
import socketServer from "../src/config/ws";

logger.info("Starting server...");

// Normalize and set the port
const port = normalizePort(process.env.PORT || "3001");
const websocketPort = normalizePort(process.env.WEBSOCKET_PORT || "8081");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", () => {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "pipe " + addr : addr ? "port " + addr.port : "";
  logger.info("Listening on " + bind);
});

socketServer.listen(websocketPort, () => {
  logger.info(`Socket.IO server is running on ws://localhost:${websocketPort}`);
});

syncDatabase();

function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
