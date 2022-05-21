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

import { ErrorHandling } from '../utils/ErrorHandling';

export const GetAllCarts = getAll(Cart);

export const GetCart = getOne(Cart, {});
export const CreateCart = createOne(Cart);
export const UpdateCart = updateOne(Cart);
export const DeleteCart = deleteOne(Cart);