import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';
import { noTransform } from 'src/utility/decorator';
import { Allow } from 'src/utility/decorator';
import { RedisService } from '../redis/redis.service';
import { DataResult, generateUUID } from 'src/utility/common';
import { RedisCache } from 'src/utility/enums';
import ms = require('ms');

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService, private readonly redisService: RedisService) {}

  /** 获取验证码 */
  @Get('captcha')
  @noTransform()
  @Allow()
  async captcha() {
    const { text, data } = this.commonService.getCode();
    const result = Buffer.from(data).toString('base64');

    const uuid = generateUUID();

    // 五分钟有效
    await this.redisService.set(`${RedisCache.CAPTCHA_CODE}${uuid}`, text, ms('5m'));
    return DataResult.ok({
      code: result,
      uuid
    });
  }
}
