import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiCode } from '../enums/api.code.enum';

export class ApiException extends HttpException {
  private msg: string;
  private code: ApiCode;

  /**
   * 自定义错误码处理
   * @param msg 错误消息
   * @param code 错误码
   * @param statusCode http 错误码，默认500
   */
  constructor(msg: string, code: ApiCode, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(msg, statusCode);

    this.msg = msg;
    this.code = code;
  }

  getErrorCode(): ApiCode {
    return this.code;
  }

  getErrorMsg(): string {
    return this.msg;
  }
}
