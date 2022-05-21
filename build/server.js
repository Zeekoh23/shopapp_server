"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import path from 'path';
const dotenv_1 = __importDefault(require("dotenv"));
//dotenv.config({ path: path.resolve(__dirname, './../config.env') });
dotenv_1.default.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN');
    console.log(err.name, err.message);
    process.exit(1);
});
const _1 = require("./");
const AppRouter_1 = require("./AppRouter");
//mongodb://localhost:27017/shop_app
const mongoose_1 = __importDefault(require("mongoose"));
const DB = process.env.DATABASE_LOCAL;
mongoose_1.default
    .connect('mongodb://localhost:27017/shop_app', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('DB Connected successfully');
})
    .catch((err) => console.log('error'));
_1.app.use(AppRouter_1.AppRouter.getInstance());
const server = _1.app.listen(3001, () => {
    console.log('app running on port 3001');
});
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});
