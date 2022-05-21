"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
//import Object from mongoose.ObjectId;
const Object1 = mongoose_1.Schema.Types.ObjectId;
const cartSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    userid: {
        type: Object1,
        ref: 'User',
    },
    /*order: {
      type: Object1,
      ref: 'Order',
    },*/
});
const Cart = (0, mongoose_1.model)('Cart', cartSchema);
exports.Cart = Cart;
