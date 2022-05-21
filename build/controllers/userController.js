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
exports.resizeUserPhoto = exports.uploadUserPhoto = exports.updateCart = exports.postCart = exports.getUser = exports.updateUser = exports.DeleteUser = exports.getAllUsers = exports.deleteMe = exports.UpdateMe = exports.GetMe = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const userModel_1 = require("../models/userModel");
const cartModel_1 = require("../models/cartModel");
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const ErrorHandling_1 = require("../utils/ErrorHandling");
const HandlerFactory_1 = require("../utils/HandlerFactory");
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObj[el] = obj[el];
    });
    return newObj;
};
const GetMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.GetMe = GetMe;
exports.UpdateMe = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.file);
    console.log(req.body);
    if (req.body.password || req.body.passwordConfirm) {
        return next(new ErrorHandling_1.ErrorHandling('This routes is not for password updates. Please use /updatemypassword', 400));
    }
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = yield userModel_1.User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
}));
exports.deleteMe = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
}));
exports.getAllUsers = (0, HandlerFactory_1.getAll)(userModel_1.User);
exports.DeleteUser = (0, HandlerFactory_1.deleteOne)(userModel_1.User);
//do not update passwords
exports.updateUser = (0, HandlerFactory_1.updateOne)(userModel_1.User);
exports.getUser = (0, HandlerFactory_1.getOne)(userModel_1.User, { path: 'user' });
exports.postCart = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const user = yield userModel_1.User.findOne({ email: req.params.email });
    const cart = new cartModel_1.Cart(req.body);
    user.carts.push(cart);
    cart.user = user;
    yield user.save();
    yield cart.save();
    res.status(201).json({
        status: 'success',
        data: {
            data: user,
        },
    });
}));
exports.updateCart = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const { email, title } = req.params;
    const user = yield userModel_1.User.findOne({ email: req.params.emails });
    const cart = yield cartModel_1.Cart.findOneAndUpdate({ title: req.params.title }, req.body, { new: true, runValidators: true });
    if (!user) {
        return next(new ErrorHandling_1.ErrorHandling('No document with user email', 404));
    }
    if (!cart) {
        return next(new ErrorHandling_1.ErrorHandling('No document with cart title', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
}));
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new ErrorHandling_1.ErrorHandling('Not image! We accept only images', 400), false);
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    yield (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
}));
