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
exports.CreateProduct = exports.UpdateProduct = exports.DeleteProduct = exports.UpdateProductWithUser = exports.GetProduct = exports.GetAllProducts = void 0;
const productModel_1 = require("../models/productModel");
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const ErrorHandling_1 = require("../utils/ErrorHandling");
const HandlerFactory_1 = require("../utils/HandlerFactory");
exports.GetAllProducts = (0, HandlerFactory_1.getAll)(productModel_1.Product);
exports.GetProduct = (0, HandlerFactory_1.getOne)(productModel_1.Product, { path: 'user' });
exports.UpdateProductWithUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield productModel_1.Product.findOneAndUpdate({ productid: req.params.productid }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new ErrorHandling_1.ErrorHandling('No document with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            doc,
        },
    });
}));
exports.DeleteProduct = (0, HandlerFactory_1.deleteOne)(productModel_1.Product);
exports.UpdateProduct = (0, HandlerFactory_1.updateOne)(productModel_1.Product);
exports.CreateProduct = (0, HandlerFactory_1.createOne)(productModel_1.Product);
