import { ApiCode } from '../enums/api.code.enum';

export class DataResult<T = any> {
  constructor(data?: any, message?: string, code: ApiCode = ApiCode.SUCCESS) {
    this.message = message;
    this.data = typeof data === 'string' && !message ? null : data;
    this.code = code;
  }

  code: ApiCode;

  message?: string;

  data?: T;

  static ok<T>(data: T, message?: string): DataResult<T>;

  static ok(message?: string): DataResult<any>;

  static ok<T>(dataOrMsg: T | string = '操作成功', message?: string): DataResult<T | undefined> {
    if (typeof dataOrMsg === 'string' && message === undefined) {
      // 当dataOrMsg是字符串且message未定义时，它被视为message
      return new DataResult<undefined>(undefined, dataOrMsg as string, ApiCode.SUCCESS);
    } else {
      // 否则，dataOrMsg被视为data，并且message是可选的
      return new DataResult<T>(dataOrMsg as T, message, ApiCode.SUCCESS);
    }
  }

  static fail(message: string, code: ApiCode, data?: undefined);
  static fail(message?: string);

  static fail(message = '操作失败', code = ApiCode.ERROR, data?: undefined) {
    return new DataResult(data, message, code);
  }
}
