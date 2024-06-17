import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ALLOW } from '../decorator';
import { RedisService } from 'src/modules/redis/redis.service';
import { Cache } from '../enums';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private redisService: RedisService;

  /** 是否白名单 */
  isWhiteList(context: ExecutionContext) {
    return this.reflector.getAllAndOverride(ALLOW, [context.getHandler(), context.getClass()]);
  }

  async canActivate(context: ExecutionContext) {
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

      const result = await this.redisService.get(`${Cache.USER_LOGIN}${request.user.uuid}`);
      if (result === null) return false;
      return true;
    } catch (e) {
      throw new UnauthorizedException('token已过期，请重新登录');
    }
  }
}
