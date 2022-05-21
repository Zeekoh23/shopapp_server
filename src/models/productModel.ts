import mongoose, { HookNextFunction, Schema, model } from 'mongoose';
const object1 = Schema.Types.ObjectId;

export interface IProduct {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isFavorite: boolean;
  userid: any;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
  isFavorite: {
    type: Boolean,
  },
  userid: {
    type: object1,
    ref: 'User',
  },
});

const Product = model<IProduct>('Product', productSchema);

export { Product };
