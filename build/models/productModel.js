"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const object1 = mongoose_1.Schema.Types.ObjectId;
const productSchema = new mongoose_1.Schema({
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
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.Product = Product;
