import { app } from './app';
import { config } from './config/index';
import connectDB from './lib/db';
import mongoose from 'mongoose';

const PORT = config.port;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}/api/${config.apiVersion}`);
    });
  })
  .catch((err) => {
    console.log('MONGO DB connection failed !!! ', err);
  });

process.on('unhandledRejection', async (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  await mongoose.disconnect();
  process.exit(1);
});

process.on('uncaughtException', async (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  await mongoose.disconnect();
  process.exit(1);
});
