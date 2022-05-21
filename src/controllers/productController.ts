import { Product } from '../models/productModel';
import CatchAsync from '../utils/CatchAsync';
import { Request, Response, NextFunction } from 'express';
import { ErrorHandling } from '../utils/ErrorHandling';
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from '../utils/HandlerFactory';

export const GetAllProducts = getAll(Product);

export const GetProduct = getOne(Product, { path: 'user' });

export const UpdateProductWithUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Product.findOneAndUpdate(
      { productid: req.params.productid },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new ErrorHandling('No document with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  }
);

export const DeleteProduct = deleteOne(Product);

export const UpdateProduct = updateOne(Product);

export const CreateProduct = createOne(Product);
