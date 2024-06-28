import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UserLoginDto } from 'src/modules/system/user/dto/user-login.dto';
import { ApiCode, RedisCache } from 'src/utility/enums';
import { RedisService } from 'src/modules/redis/redis.service';
import { ApiException } from 'src/utility/common';
import { Request } from 'express';
import { LoginStatus } from 'src/modules/system/login-log/enums/login.status.enum';
import { LoginLogService } from 'src/modules/system/login-log/login-log.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly redisService: RedisService, private loginLogService: LoginLogService, private readonly authService: AuthService) {
    super({
      usernameField: 'account',
      passReqToCallback: true
    });
  }

  async validate(request: Request, account: string, password: string) {
    const body = request.body as UserLoginDto;
    const { uuid, code } = body;
    const redisKey = `${RedisCache.CAPTCHA_CODE}${uuid}`;
    const redisCode = await this.redisService.get(redisKey);

    if (!code) throw new ApiException('验证码不能为空', ApiCode.BAD, HttpStatus.BAD_REQUEST);
    if (!uuid) throw new ApiException('uuid不能为空', ApiCode.BAD, HttpStatus.BAD_REQUEST);
    if (!account) throw new ApiException('账号不能为空', ApiCode.BAD, HttpStatus.BAD_REQUEST);
    if (!password) throw new ApiException('密码不能为空', ApiCode.BAD, HttpStatus.BAD_REQUEST);

    if (redisCode === null) {
      this.loginLogService.create({
        code: LoginStatus.FAIL,
        msg: '验证码已过期',
        request
      });
      throw new ApiException('验证码过期', ApiCode.CODE_EXPIRED, HttpStatus.OK);
    }
    if (redisCode.toLowerCase() !== code.toLowerCase()) {
      this.loginLogService.create({
        code: LoginStatus.FAIL,
        msg: '验证码错误',
        request
      });
      this.redisService.delete(uuid);
      throw new ApiException('验证码错误', ApiCode.CODE_INVALID, HttpStatus.OK);
    }

    const user = await this.authService.validateUser(request, account, password);
    return user;
  }
}
