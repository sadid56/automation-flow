import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';

const errorHandler = (
  err: Error & { statusCode?: number; errors?: unknown[] },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let { statusCode = 500, message = 'Internal Server Error' } = err;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const response = {
    success: false,
    message,
    errors: err.errors || [],
    ...(config.env === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export { errorHandler };
