import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      passReqToCallback: true, // 如果为true，则将请求对象作为回调函数的第一个参数 verify(request, jwt_payload, done_callback)。
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request
      ignoreExpiration: false, // 如果为true，则不验证令牌的过期时间。
      secretOrKey: configService.get<string>('jwt.secret')
    });
  }

  async validate(request: Request, payload: any) {
    request.user = payload.user;
    return payload.user;
  }
}
