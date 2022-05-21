export class ErrorHandling extends Error {
  statusCode: number;
  status: string;

  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message); //we use super when we are calling a parent constructor from a parent class
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
