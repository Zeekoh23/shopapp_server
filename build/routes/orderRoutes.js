"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderrouter = void 0;
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const orderrouter = express_1.default.Router();
exports.orderrouter = orderrouter;
//orderrouter.use('/:orderid/products', cartrouter);
orderrouter.route('/products/:products/orders').get(orderController_1.getOrderOfCarts);
orderrouter.route('/').get(orderController_1.GetAllOrders);
orderrouter.route('/').post(orderController_1.CreateOrder);
orderrouter.route('/:id').get(orderController_1.GetOrder).delete(orderController_1.DeleteOrder);
orderrouter.route('/:amount').post(orderController_1.UpdateOrder);
