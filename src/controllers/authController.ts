import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import util from 'util';
import { User, IUserDoc } from '../models/userModel';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import CatchAsync from '../utils/CatchAsync';
import jwt from 'jsonwebtoken';
import { ErrorHandling } from '../utils/ErrorHandling';
import { Email } from '../utils/email';
import crypto from 'crypto';

const secret: any = process.env.JWT_SECRET;
const mycookie: any = process.env.JWT_COOKIE_EXPIRES_IN;
const dblocal: any = process.env.DATABASE_LOCAL;

export function signToken(id: any) {
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

const checktoken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers['authorization'];
  console.log(token);
  next();
};

export function createSendToken(
  user: any,
  statusCode: number,
  res: any,
  req: any
) {
  const token: any = signToken(user._id);

  const cookieOptions: any = {
    expires: new Date(Date.now() + mycookie * 24 * 60 * 60 * 1000),
    maxAge: new Date(Date.now() + mycookie * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  //remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
}

export const signup = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);
    const url: string = `${req.protocol}://${req.get('host')}/me`;
    await new Email(user, url).sendWelcome();
    createSendToken(user, 201, res, req);
  }
);

export const login = CatchAsync(
  async (req: Request, res: any, next: NextFunction) => {
    const { email, password } = req.body;

    //check if email and password
    if (!email || !password) {
      return next(new ErrorHandling('Please provide email and password', 400));
    }

    //check if user exist and if password is correct
    const user = await User.findOne({ email }).select('+password');
    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new ErrorHandling('Incorrect email or password', 401)); //unauthorised
    }
    //if everything is okay send something to the client
    createSendToken(user, 200, res, req);
  }
);

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const protect = CatchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new ErrorHandling(
          'You are not logged in. Please log in to get access',
          401
        )
      );
    }

    //2 verification token

    const decoded: any = await jwt.verify(token, secret);
    console.log(decoded);

    //check if user still exists

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        new ErrorHandling(
          'The user belonging to the token does no longer exist',
          401
        )
      );
    }

    //check if user change password was issued. But not yet working
    if (await freshUser.changePasswordAfter(decoded.iat)) {
      return next(
        new ErrorHandling(
          'User recently changed password! Please log in again',
          401
        )
      );
    }

    //grant access to protected route
    req.user = freshUser;
    res.locals.user = freshUser;
    next();
  }
);

//only for logged in rendered pages
export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.jwt) {
    try {
      //2 verifies token

      const decoded: any = await jwt.verify(req.cookies.jwt, secret);
      console.log(decoded);

      //check if user still exists

      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }

      //check if user change password was issued. But not yet working
      if (await freshUser.changePasswordAfter(decoded.iat)) {
        return next();
      }

      //there is a logged in user
      res.locals.user = freshUser;
      return next();
    } catch (err: any) {
      return next();
    }
  }
  next();
};

export function restrictTo(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandling(
          'You do not have permission to perform this action',
          403
        )
      );
    }
    next();
  };
}

export const forgotPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //get user based on posted email
    const { email } = req.body;

    const user1: any = await User.findOne({ email });

    console.log(user1);
    if (!user1) {
      return next(
        new ErrorHandling('There is no user with email address', 404)
      );
    }

    //generate the random reset token
    const resetToken = user1.createPasswordResetToken();
    await user1.save({ validateBeforeSave: false });

    //send to users email

    try {
      const url: string = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetpassword/${resetToken}`;
      await new Email(user1, url).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (err: any) {
      user1.token = undefined;
      user1.expiryDate = undefined;

      await user1.save({ validateBeforeSave: false });

      return next(
        new ErrorHandling(
          'There was an error sending the email, try again later!',
          500
        )
      );
    }
  }
);

export const resetPassword = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user: any = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //if token has not expired and there is user, set the new password
    if (!user) {
      return next(new ErrorHandling('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.token = undefined;
    user.expiryDate = undefined;
    await user.save();

    //log the user in, send JWT
    createSendToken(user, 200, res, req);
  }
);

export const updatePassword = CatchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    //get user from collection
    const user1: any = await User.findById(req.user.id).select('+password');

    //check if posted current password is correct
    if (
      !(await user1.correctPassword(req.body.passwordCurrent, user1.password))
    ) {
      return next(new ErrorHandling('Your current password is wrong', 401));
    }

    //if so, update password
    user1.password = req.body.password;
    user1.passwordConfirm = req.body.passwordConfirm;
    await user1.save();
    //user.findbyidandupdate will not work as intended

    //log user in, send jwt
    createSendToken(user1, 200, res, req);
  }
);
