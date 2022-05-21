import express, { Request, Response, NextFunction } from 'express';
import CatchAsync from '../utils/CatchAsync';
import { ErrorHandling } from './ErrorHandling';
import { APIFeatures } from './APIFeatures';

export const deleteOne = (Model: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findOneAndDelete(req.params.sid);
    if (!doc) {
      return next(new ErrorHandling('No doc found by that id', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted tour!',
    });
  });

export const updateOne = (Model: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findOneAndUpdate(req.params.sid, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new ErrorHandling('No doc found by that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

export const getOne = (Model: any, popOptions?: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new ErrorHandling('No doc found with that id', 404));
    }

    res.status(200).json({
      status: 'He man you succeed!!',
      data: {
        doc,
      },
    });
  });

export const getAll = (Model: any, popOptions?: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter;
    if (req.params.products) filter = { products: req.params.products };
    // EXECUTE QUERY
    const features: any = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      ...doc,
    });
  });
