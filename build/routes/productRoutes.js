"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productrouter = void 0;
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const productrouter = express_1.default.Router();
exports.productrouter = productrouter;
productrouter.route('/').get(productController_1.GetAllProducts).post(productController_1.CreateProduct);
productrouter
    .route('/:sid')
    .get(productController_1.GetProduct)
    .post(productController_1.UpdateProduct)
    .delete(productController_1.DeleteProduct);
//productrouter.route('/:userid/:productid').post(UpdateProduct);
productrouter.route('/:productid/user/:userid').post(productController_1.UpdateProductWithUser);
