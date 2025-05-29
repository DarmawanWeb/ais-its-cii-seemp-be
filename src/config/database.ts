import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const dbName = process.env.MONGO_DB_NAME || 'default_db';
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI environment variable is not defined.');
}

export const syncDatabase = async () => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      dbName,
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
