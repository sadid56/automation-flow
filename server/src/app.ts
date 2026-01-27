import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import chalk from 'chalk';
import { config } from './config/index';
import routes from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Logging
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const [method, url, status, contentLength, , responseTime] = message.split(' ');

        let statusColor = chalk.green;
        if (parseInt(status) >= 500) statusColor = chalk.red;
        else if (parseInt(status) >= 400) statusColor = chalk.yellow;
        else if (parseInt(status) >= 300) statusColor = chalk.cyan;

        const coloredLog = `${chalk.bold(method)} ${chalk.blue(url)} ${statusColor(status)} ${chalk.gray(contentLength)} - ${chalk.magenta(responseTime)} ms`;
        console.log(coloredLog);
      },
    },
  }),
);

// API Routes
app.use(`/api/${config.apiVersion}`, routes);

// Error Handling
app.use(errorHandler);

export { app };
