"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const object1 = mongoose_1.Schema.Types.ObjectId;
const orderSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
    },
    /*products: {
      type: Object,
      ref: 'Cart',
    },*/
    products: {
        type: Object,
    },
    dateTime: {
        type: String,
    },
    userid: {
        type: object1,
        ref: 'User',
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/*orderSchema.pre(/^find/, function (next: HookNextFunction) {
  this.populate({
    path: 'products',
    select: 'title quantity price',
  });
  next();
});*/
/*orderSchema.virtual('products', {
  ref: 'Cart',
  foreignField: 'order',
  localField: '_id',
});*/
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.Order = Order;
