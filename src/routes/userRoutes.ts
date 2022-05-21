import express, { Router } from 'express';

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} from '../controllers/authController';

import {
  getAllUsers,
  UpdateMe,
  deleteMe,
  DeleteUser,
  updateUser,
  getUser,
  GetMe,
  uploadUserPhoto,
  resizeUserPhoto,
} from '../controllers/userController';

const userrouter: Router = express.Router();

userrouter.post('/signup', signup);
userrouter.post('/login', login);
userrouter.get('/logout', logout);

userrouter.post('/forgotpassword', forgotPassword);
userrouter.post('/resetpassword/:token', resetPassword);

//protect all routes after this middleware
userrouter.use(protect);

userrouter.post('/updatemypassword', updatePassword);
userrouter.get('/me', GetMe, getUser);
userrouter.post('/updateme', uploadUserPhoto, resizeUserPhoto, UpdateMe);
userrouter.delete('/deleteme', deleteMe);

userrouter.use(protect);

userrouter.route('/').get(getAllUsers);

userrouter.route('/:id').get(getUser).post(updateUser).delete(DeleteUser);

export = userrouter;
