import dotenv from 'dotenv';

dotenv.config();

interface Config {
  mongo: {
    username: string;
    password: string;
    dbName: string;
    uri: string;
  };
  server: {
    port: number;
  };
  cors: {
    origin: string[];
  };
  environment: string;
  jwt: {
    secret: string;
    expiration: string;
  };
  refreshToken: {
    secret: string;
    expiration: string;
  };
  websocket: {
    url: string;
    token: string;
  };
}

const config: Config = {
  mongo: {
    username: process.env.MONGO_INITDB_ROOT_USERNAME || 'your_mongo_username',
    password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'your_mongo_password',
    dbName: process.env.MONGO_DB_NAME || 'your_db_name',
    uri:
      process.env.MONGO_URI ||
      `mongodb://${
        process.env.MONGO_INITDB_ROOT_USERNAME || 'your_mongo_username'
      }:${
        process.env.MONGO_INITDB_ROOT_PASSWORD || 'your_mongo_password'
      }@localhost:27017/${
        process.env.MONGO_DB_NAME || 'your_db_name'
      }?authSource=admin`,
  },
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
  },
  server: {
    port: Number(process.env.PORT) || 3003,
  },
  environment: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
    expiration: process.env.JWT_EXPIRATION || '1h',
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret',
    expiration: process.env.REFRESH_TOKEN_EXPIRATION || '30d',
  },
  websocket: {
    url: process.env.WEBSOCKET_URI || 'http://localhost:8080',
    token: process.env.WEBSOCKET_TOKEN || 'your_websocket_token',
  },
};

export default config;
