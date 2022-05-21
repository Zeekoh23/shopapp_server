import mongoose, {
  HookNextFunction,
  Schema,
  model,
  Document,
  Model,
} from 'mongoose';

const Object1 = Schema.Types.ObjectId;

export interface ICart {
  title: string;
  quantity: number;
  price: number;
  userid: any;
  order: any;
}

const cartSchema = new Schema<ICart>({
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
});

const Cart = model<ICart>('Cart', cartSchema);

export { Cart };
