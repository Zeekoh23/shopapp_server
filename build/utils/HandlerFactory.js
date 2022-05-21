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
exports.getAll = exports.getOne = exports.createOne = exports.updateOne = exports.deleteOne = void 0;
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const ErrorHandling_1 = require("./ErrorHandling");
const APIFeatures_1 = require("./APIFeatures");
/*exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No doc found by that id', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted tour!',
    });
  });*/
const deleteOne = (Model) => (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findOneAndDelete(req.params.sid);
    if (!doc) {
        return next(new ErrorHandling_1.ErrorHandling('No doc found by that id', 404));
    }
    res.status(204).json({
        status: 'success',
        message: 'Successfully deleted tour!',
    });
}));
exports.deleteOne = deleteOne;
/*exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No doc found by that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });*/
const updateOne = (Model) => (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.findOneAndUpdate(req.params.sid, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new ErrorHandling_1.ErrorHandling('No doc found by that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
}));
exports.updateOne = updateOne;
/*exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });*/
const createOne = (Model) => (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            doc,
        },
    });
}));
exports.createOne = createOne;
/*exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No doc found with that id', 404));
    }

    res.status(200).json({
      status: 'He man you succeed!!',
      data: {
        doc,
      },
    });
  });*/
const getOne = (Model, popOptions) => (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = Model.findById(req.params.id);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = yield query;
    if (!doc) {
        return next(new ErrorHandling_1.ErrorHandling('No doc found with that id', 404));
    }
    res.status(200).json({
        status: 'He man you succeed!!',
        data: {
            doc,
        },
    });
}));
exports.getOne = getOne;
/*exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter;
    if (req.params.tour) filter = { tour: req.params.tour };
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });*/
const getAll = (Model, popOptions) => (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filter;
    if (req.params.products)
        filter = { products: req.params.products };
    // EXECUTE QUERY
    const features = new APIFeatures_1.APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // const doc = await features.query.explain();
    const doc = yield features.query;
    // SEND RESPONSE
    res.status(200).json(Object.assign({}, doc));
}));
exports.getAll = getAll;
