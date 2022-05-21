import multer from 'multer';
import sharp from 'sharp';
import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import { Order } from '../models/orderModel';
import { Cart } from '../models/cartModel';
import { IUserDoc } from '../models/userModel';
import CatchAsync from '../utils/CatchAsync';
import { ErrorHandling } from '../utils/ErrorHandling';
import { deleteOne, updateOne, getOne, getAll } from '../utils/HandlerFactory';

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};

  Object.keys(obj).forEach((el: any) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const GetMe = (req: any, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

export const UpdateMe = CatchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    console.log(req.file);
    console.log(req.body);

    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new ErrorHandling(
          'This routes is not for password updates. Please use /updatemypassword',
          400
        )
      );
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser: any = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = CatchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

export const getAllUsers = getAll(User);

export const DeleteUser = deleteOne(User);

//do not update passwords
export const updateUser = updateOne(User);

export const getUser = getOne(User, { path: 'user' });

export const postCart = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    const user: any = await User.findOne({ email: req.params.email });

    const cart: any = new Cart(req.body);
    user.carts.push(cart);
    cart.user = user;

    await user.save();
    await cart.save();

    res.status(201).json({
      status: 'success',
      data: {
        data: user,
      },
    });
  }
);

export const updateCart = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.params.emails });
    const cart = await Cart.findOneAndUpdate(
      { title: req.params.title },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ErrorHandling('No document with user email', 404));
    }

    if (!cart) {
      return next(new ErrorHandling('No document with cart title', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
);

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ErrorHandling('Not image! We accept only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = CatchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  }
);
