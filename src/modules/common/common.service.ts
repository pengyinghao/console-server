import { Injectable } from '@nestjs/common';
import * as code from 'svg-captcha';

@Injectable()
export class CommonService {
  /** 获取验证码 */
  getCode() {
    return code.create({
      size: 4,
      ignoreChars: '0o1iIl',
      noise: 3,
      color: true,
      background: '#fff',
      fontSize: 60,
    });
  }
}
