"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandling = void 0;
class ErrorHandling extends Error {
    constructor(message, statusCode) {
        super(message); //we use super when we are calling a parent constructor from a parent class
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ErrorHandling = ErrorHandling;
