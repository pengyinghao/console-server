import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ALLOW } from '../decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  /** 是否白名单 */
  isWhiteList(context: ExecutionContext) {
    return this.reflector.getAllAndOverride(ALLOW, [context.getHandler(), context.getClass()]);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 如果设置白名单，直接返回
    if (this.isWhiteList(context)) return true;

    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization || '';
    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      request.user = data.user;
      return true;
    } catch {
      throw new UnauthorizedException('token已过期，请重新登录');
    }
  }
}
