import express, { Router } from 'express';

import {
  GetOrder,
  GetAllOrders,
  CreateOrder,
  UpdateOrder,
  DeleteOrder,
  getOrderOfCarts,
} from '../controllers/orderController';

import { cartrouter } from './cartRoutes';

const orderrouter: Router = express.Router();

orderrouter.route('/products/:products/orders').get(getOrderOfCarts);
orderrouter.route('/').get(GetAllOrders);
orderrouter.route('/').post(CreateOrder);

orderrouter.route('/:id').get(GetOrder).delete(DeleteOrder);

orderrouter.route('/:amount').post(UpdateOrder);

export { orderrouter };
