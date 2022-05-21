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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = require("../../models/productModel");
const DB = process.env.DATABASE_LOCAL;
mongoose_1.default
    .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('DB connected successfully');
})
    .catch((err) => console.log('ERROR'));
const products = JSON.parse(fs_1.default.readFileSync(`${__dirname}/products.json`, 'utf-8'));
function importData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield productModel_1.Product.create(products);
            console.log('Data successfully loaded');
        }
        catch (err) {
            console.log(err);
        }
        process.exit();
    });
}
function deleteData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield productModel_1.Product.deleteMany();
            console.log('Data successfully deleted');
        }
        catch (err) {
            console.log(err);
        }
        process.exit();
    });
}
if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}
console.log(process.argv);
