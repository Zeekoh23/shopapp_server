import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';

import { ErrorHandling } from './utils/ErrorHandling';
import userrouter from './routes/userRoutes';
import { productrouter } from './routes/productRoutes';
import { orderrouter } from './routes/orderRoutes';
import { cartrouter } from './routes/cartRoutes';
import { GlobalErrorHandler } from './controllers/errorController';

const app = express();

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.NODE_ENV);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Hello from the middleware gang');
  next();
});

app.use('/api/v1/products', productrouter);
app.use('/api/v1/users', userrouter);
app.use('/api/v1/orders', orderrouter);
app.use('/api/v1/carts', cartrouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new ErrorHandling(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandler);

export { app };
