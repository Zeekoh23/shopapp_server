import express, { Router } from 'express';

import {
  GetCart,
  GetAllCarts,
  CreateCart,
  UpdateCart,
  DeleteCart,
} from '../controllers/cartController';

const cartrouter: Router = express.Router({ mergeParams: true });

cartrouter.route('/').post(CreateCart).get(GetAllCarts);

cartrouter.route('/:id').get(GetCart);

cartrouter.route('/delete').delete(DeleteCart);

cartrouter.route('/:title').post(UpdateCart);

export { cartrouter };
