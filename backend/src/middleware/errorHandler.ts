import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      status: 'error',
      statusCode: 422,
      message: 'Validation Error',
      errors: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Unauthorized'
    });
  }

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal server error'
  });
};