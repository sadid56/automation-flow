import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const duration = Date.now() - start;
    const now = new Date();
    const day = now.getDate();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}${ampm}`;
    const timestamp = chalk.hex('#AAAAAA')(`${day} ${month}, ${year} - ${timeString}`);
    // Colorize HTTP method
    const coloredMethod = (() => {
      switch (method) {
        case 'GET':
          return chalk.hex('#4dc9f6')(method.padEnd(6));
        case 'POST':
          return chalk.hex('#94ec6c')(method.padEnd(6));
        case 'PUT':
          return chalk.hex('#f6c177')(method.padEnd(6));
        case 'DELETE':
          return chalk.hex('#eb6f92')(method.padEnd(6));
        case 'PATCH':
          return chalk.hex('#c4a7e7')(method.padEnd(6));
        default:
          return chalk.hex('#FFFFFF')(method.padEnd(6));
      }
    })();
    // Colorize status code
    const coloredStatus = (() => {
      if (statusCode >= 500) return chalk.hex('#eb6f92').bold(statusCode);
      if (statusCode >= 400) return chalk.hex('#f6c177').bold(statusCode);
      if (statusCode >= 300) return chalk.hex('#4dc9f6').bold(statusCode);
      if (statusCode >= 200) return chalk.hex('#94ec6c').bold(statusCode);
      return chalk.hex('#e0def4')(statusCode);
    })();
    // Colorize duration
    const coloredDuration = (() => {
      if (duration > 2000) return chalk.hex('#eb6f92').bold(`${duration}ms`);
      if (duration > 500) return chalk.hex('#f6c177')(`${duration}ms`);
      return chalk.hex('#94ec6c')(`${duration}ms`);
    })();
    // Create status icon and message
    const statusIcon = statusCode >= 400 ? chalk.hex('#eb6f92')('✗') : chalk.hex('#94ec6c')('✓');
    const statusMessage =
      statusCode >= 400 ? chalk.hex('#eb6f92')('ERROR') : chalk.hex('#94ec6c')('SUCCESS');
    // Create URL path with query params dimmed
    const [basePath, queryString] = originalUrl.split('?');
    const coloredUrl = queryString
      ? `${chalk.hex('#e0def4')(basePath)}${chalk.hex('#6C7082')('?' + queryString)}`
      : chalk.hex('#e0def4')(basePath);
    console.log(
      `${chalk.gray('┃')} ${timestamp} ${chalk.hex('#6C7082')('│')}`,
      `${coloredMethod} ${coloredUrl}`,
      `${chalk.hex('#6C7082')('→')}`,
      `${statusIcon} ${coloredStatus} ${chalk.hex('#6C7082')('│')}`,
      `${statusMessage}`,
      `${chalk.hex('#6C7082')('(')}${coloredDuration}${chalk.hex('#6C7082')(')')}`,
    );
  });
  next();
}
