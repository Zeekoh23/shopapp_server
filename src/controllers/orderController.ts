import { Order } from '../models/orderModel';
import { Cart, ICart } from '../models/cartModel';
import { User } from '../models/userModel';
import CatchAsync from '../utils/CatchAsync';
import { APIFeatures } from '../utils/APIFeatures';
import { Request, Response, NextFunction } from 'express';
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from '../utils/HandlerFactory';

export const CreateOrder = createOne(Order);

export const UpdateOrder = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = new Order(req.body);

    const carts1 = new Cart(req.body);

    order.products.push(carts1);
    carts1.order = carts1;

    await order.save();
    await carts1.save();

    res.status(201).json({
      status: 'success',
      data: {
        data: order,
      },
    });
  }
);

export const getOrderOfCarts = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Cart.find({ products: req.params.products }).select(
      '-__v'
    );
    res.status(201).json({
      status: 'success',
      data: {
        orders,
      },
    });
  }
);

export const GetAllOrders = getAll(Order);

export const GetOrder = getOne(Order, { path: 'products' });

export const DeleteOrder = deleteOne(Order);
