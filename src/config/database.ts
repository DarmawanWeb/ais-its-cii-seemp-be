import mongoose from 'mongoose';
import logger from './logger';
import config from './config';

if (!config.mongo.uri) {
  throw new Error('MONGO_URI environment variable is not defined.');
}

export const syncDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongo.uri, {
      dbName: config.mongo.dbName,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Error: ${err.message}`);
    } else {
      logger.error(`Error: ${String(err)}`);
    }
    process.exit(1);
  }
};

export default mongoose;
