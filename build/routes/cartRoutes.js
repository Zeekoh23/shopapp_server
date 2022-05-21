"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartrouter = void 0;
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const cartrouter = express_1.default.Router({ mergeParams: true });
exports.cartrouter = cartrouter;
cartrouter.route('/').post(cartController_1.CreateCart).get(cartController_1.GetAllCarts);
cartrouter.route('/:id').get(cartController_1.GetCart);
cartrouter.route('/delete').delete(cartController_1.DeleteCart);
cartrouter.route('/:title').post(cartController_1.UpdateCart);
