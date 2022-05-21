"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteOrder = exports.GetOrder = exports.GetAllOrders = exports.getOrderOfCarts = exports.UpdateOrder = exports.CreateOrder = void 0;
const orderModel_1 = require("../models/orderModel");
const cartModel_1 = require("../models/cartModel");
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const HandlerFactory_1 = require("../utils/HandlerFactory");
/*export const CreateOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.user
    .populate('cart.items.id')
    .execPopulate()
    .then((user: any) => {
      const products = user.cart.items.map((i: any) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result: any) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err: any) => console.log(err));
};*/
/*export const CreateOrder = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: any = await User.findOne({ email: req.params.email }).populate(
      'cart.items.id'
    );

    const products1 = user.cart.items.map((i: any) => {
      return { quantity: req.body.quantity, products: { ...req.body.id._doc } };
    });

    const order = new Order({
      amount: req.body.amount,
      dateTime: req.body.dateTime,
      users: {
        name: user.name,
        id: user.id,
      },
      products: products1,
    });

    //const order = new Order();

    await order.save();

    res.status(201).json({
      status: 'success',
      data: {
        data: order,
      },
    });
  }
);*/
/*export const setCartIds = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.products) req.body.products = req.params.products;
  next();
};*/
exports.CreateOrder = (0, HandlerFactory_1.createOne)(orderModel_1.Order);
/*export const CreateOrder = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.create(req.body);
    await Cart.deleteMany({});

    //const order = new Order(req.body);
    //const carts = await Cart.create(req.body);
    //const carts = new Cart(req.body);

    //const carts: ICart = await Cart.findOne({ title: req.params.title });

    /*order.products.push(carts);
    carts.order = order;

    await order.save();
    await carts.save();*/
/*res.status(201).json({
      status: 'success',
      data: {
        data: order,
      },
    });
  }
);*/
exports.UpdateOrder = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const order = await Order.findOne({ amount: req.params.amount });
    //const carts: ICart = await Cart.findOne({ title: req.params.title });
    const order = new orderModel_1.Order(req.body);
    /* req.body.title = carts.title;
    req.body.quantity = carts.quantity;
    req.body.price = carts.price;*/
    const carts1 = new cartModel_1.Cart(req.body);
    order.products.push(carts1);
    carts1.order = carts1;
    yield order.save();
    yield carts1.save();
    res.status(201).json({
        status: 'success',
        data: {
            data: order,
        },
    });
}));
exports.getOrderOfCarts = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield cartModel_1.Cart.find({ products: req.params.products }).select('-__v');
    res.status(201).json({
        status: 'success',
        data: {
            orders,
        },
    });
}));
exports.GetAllOrders = (0, HandlerFactory_1.getAll)(orderModel_1.Order);
/*export const GetAllOrders = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //to allow for nested get reviews on tour

    let filter = {};
    //if (req.params.id) filter = { id: req.params.id };

    const features = new APIFeatures(
      Order.find().populate('products'),
      req.query
    )
      .filter(req, res)
      .sorting(req, res)
      .limiting(req, res)
      .pagination(req, res);

    //if (popOptions) features.query = features.query.populate(popOptions);
    //const doc = await features.query.explain();
    const doc = await features.query;

    //const doc3 = doc.substring(9, doc.length);

    //const map1 = doc.map();

    res.status(200).json({
      ...doc,
      //status: 'success',
      //results: doc.length,
      //data: {
      //doc,
      //},
    });
  }
);*/
exports.GetOrder = (0, HandlerFactory_1.getOne)(orderModel_1.Order, { path: 'products' });
/*export const GetOrder = CatchAsync(
  async (req: Request, res: Response, next: NextFunction, id: any) => {
    const order = await Order.findOne({ amount: req.params.amount }).populate({
      path: 'products',
      fields: 'title quantity price',
    });

    if (!order) {
      return next(new ErrorHandling('There is no order', 404));
    }

    res.status(200).json({
      status: 'success',
      order,



      id,
    });
  }
);*/
exports.DeleteOrder = (0, HandlerFactory_1.deleteOne)(orderModel_1.Order);
//export const UpdateOrder = UpdateOne(Order);
//export const CreateOrder = createOne(Order);
