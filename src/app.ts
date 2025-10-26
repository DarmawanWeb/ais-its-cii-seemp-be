import express, { Application, Request, Response, NextFunction } from 'express';
import { notFoundHandler } from './middlewares/error.middleware';
import promClient from 'prom-client';
import helmet from 'helmet';
import v1Routes from './routes/index';
import cors from 'cors';
import corsOptions from './config/cors';


const app: Application = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const requestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Histogram of HTTP request durations',
  buckets: [0.1, 0.5, 1, 2, 5],
  labelNames: ['statusCode'],
});

app.use((_req: Request, res: Response, next: NextFunction) => {
  const end = requestDuration.startTimer();
  res.on('finish', () => {
    end({ statusCode: res.statusCode });
  });
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the API',
    status: 'success',
  });
});

app.use('/api', v1Routes);
app.use(notFoundHandler);

export default app;
