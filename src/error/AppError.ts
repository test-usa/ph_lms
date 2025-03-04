import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  constructor(
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR, 
    message: string = 'Internal Server Error', 
    stack: string = ''
  ) {
    super(message, statusCode);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
