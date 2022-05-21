import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN');
  console.log(err.name, err.message);
  process.exit(1);
});

import { app } from './';
import { AppRouter } from './AppRouter';

import mongoose from 'mongoose';

const DB: any = process.env.DATABASE_LOCAL;

mongoose
  .connect('mongodb://localhost:27017/shop_app', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected successfully');
  })
  .catch((err) => console.log('error'));

app.use(AppRouter.getInstance());

const server = app.listen(3001, () => {
  console.log('app running on port 3001');
});

process.on('unhandledRejection', (err: any) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
