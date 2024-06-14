import { CallHandler, ExecutionContext, HttpStatus, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { NO_TRANSFORM } from '../decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  @Inject()
  private reflector: Reflector;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 不需要处理数据格式，直接返回
    const noTransform = this.reflector.getAllAndOverride(NO_TRANSFORM, [context.getClass(), context.getHandler()]);
    if (noTransform) {
      return next.handle();
    }

    const requestType = context.getType();
    if (requestType === 'http') {
      const res: Response = context.switchToHttp().getResponse();
      return next.handle().pipe(
        map((data) => {
          if (res.statusCode === HttpStatus.CREATED) res.status(HttpStatus.OK);
          return data;
        })
      );
    }
    return next.handle();
  }
}
