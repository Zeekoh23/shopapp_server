import express, { Router } from 'express';

import {
  GetProduct,
  GetAllProducts,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  UpdateProductWithUser,
} from '../controllers/productController';

const productrouter: Router = express.Router();

productrouter.route('/').get(GetAllProducts).post(CreateProduct);

productrouter
  .route('/:sid')
  .get(GetProduct)
  .post(UpdateProduct)
  .delete(DeleteProduct);

productrouter.route('/:productid/user/:userid').post(UpdateProductWithUser);

export { productrouter };
