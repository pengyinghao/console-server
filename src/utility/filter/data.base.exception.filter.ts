import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { ApiCode } from 'src/utility/enums';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;
    this.logger.error(exception.stack);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ApiCode.ERROR,
      message: `数据库发生异常: ${message}`
    });
  }
}
