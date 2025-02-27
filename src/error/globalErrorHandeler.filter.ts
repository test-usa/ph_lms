import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalErrorHandlerFilter<T> implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // ✅ Check if exception or response is undefined
    if (!exception) {
      Logger.error('Caught undefined exception!');
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!response) {
      Logger.error('Response object is undefined!');
      return;
    }

    // ✅ Handle Known Exceptions
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error)?.message || 'Internal server error';

    // ✅ Send Error Response with Request Info
    response.status(status).json({
        statusCode: status,
        message: typeof message === 'string' 
          ? message 
          : (message as any)?.message[0] ?? 'An error occurred',
        error: true,
        path: request?.url || 'unknown',
        method: request?.method || 'unknown',
        timestamp: new Date().toISOString(),
      });

    // ✅ Log the Exception for Debugging
    console.error('Exception caught:', exception);
  }
}
