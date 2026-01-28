import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

const getHealthStatus = (_req: Request, res: Response) => {
  const uptime = process.uptime();
  res.status(200).json(
    new ApiResponse(
      200,
      {
        status: 'OK',
        uptime: Math.floor(uptime),
        uptimeString: formatUptime(uptime),
      },
      'Health check passed',
    ),
  );
};

export { getHealthStatus };
