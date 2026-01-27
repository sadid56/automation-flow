import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';

const getHealthStatus = (_req: Request, res: Response) => {
  res
    .status(200)
    .json(new ApiResponse(200, { status: 'OK', uptime: process.uptime() }, 'Health check passed'));
};

export { getHealthStatus };
