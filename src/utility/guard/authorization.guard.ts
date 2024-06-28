import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOW } from '../decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isAllow = this.reflector.getAllAndOverride<boolean>(ALLOW, [context.getHandler(), context.getClass()]);

    // 如果设置白名单，直接返回
    if (isAllow) return true;

    return super.canActivate(context);
    // const request: Request = context.switchToHttp().getRequest();

    // const authorization = request.headers.authorization || '';
    // if (!authorization) {
    //   throw new UnauthorizedException('用户未登录');
    // }
    // try {
    //   const token = authorization.split(' ')[1];
    //   const data = this.jwtService.verify(token);
    //   request.user = data.user;

    //   const result = await this.redisService.get(`${Cache.USER_LOGIN}${request.user.uuid}`);
    //   if (result === null) return false;
    //   return true;
    // } catch (e) {
    //   throw new UnauthorizedException('token已过期，请重新登录');
    // }
  }
}
