import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { formatError } from './format-error.util';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 🔍 Log the full exception for internal debugging
    this.logger.error('Exception thrown:', exception);
    if (exception?.stack) {
      this.logger.error(exception.stack);
    }

    const { statusCode, message, errors } = formatError(exception);
    return response.status(statusCode).json({
      statusCode,
      message,
      errors,
    });
  }
}
