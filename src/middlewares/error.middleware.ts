import { Response, Request } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Not Found for route darr ${req.originalUrl}`,
    status: 404,
    success: false,
  });
};

export class BaseError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 409);
  }
}
