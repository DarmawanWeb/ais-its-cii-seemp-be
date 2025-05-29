import { Response } from 'express';
import { BaseError } from '../middlewares/error.middleware';

export const handleError = (error: unknown, res: Response) => {
  const statusCode = error instanceof BaseError ? error.statusCode : 500;
  res.status(statusCode).json({
    message: (error as Error).message,
    status: statusCode,
    success: false,
  });
};
