"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const ErrorHandling_1 = require("./utils/ErrorHandling");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = require("./routes/productRoutes");
const orderRoutes_1 = require("./routes/orderRoutes");
const cartRoutes_1 = require("./routes/cartRoutes");
const errorController_1 = require("./controllers/errorController");
const app = (0, express_1.default)();
exports.app = app;
//development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
console.log(process.env.NODE_ENV);
app.use((req, res, next) => {
    console.log('Hello from the middleware gang');
    next();
});
app.use('/api/v1/products', productRoutes_1.productrouter);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/orders', orderRoutes_1.orderrouter);
app.use('/api/v1/carts', cartRoutes_1.cartrouter);
app.all('*', (req, res, next) => {
    next(new ErrorHandling_1.ErrorHandling(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.GlobalErrorHandler);
