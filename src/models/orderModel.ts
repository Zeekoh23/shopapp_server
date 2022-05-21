import mongoose, { HookNextFunction, Schema, model } from 'mongoose';
const object1 = Schema.Types.ObjectId;
export interface IOrder {
  amount: any;
  products: any;
  dateTime: string;
}

const orderSchema = new Schema<IOrder>(
  {
    amount: {
      type: Number,
    },

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = model<IOrder>('Order', orderSchema);

export { Order };
