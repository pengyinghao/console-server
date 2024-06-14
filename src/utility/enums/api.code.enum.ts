export enum ApiCode {
  /** 成功 */
  SUCCESS = 0,
  /** 操作失败 */
  ERROR = 500,
  BAD = 400,

  /** 验证码错误 */
  CODE_INVALID = 10000,
  /** 验证码过期 */
  CODE_EXPIRED = 10001,
  /** 数据不存在 */
  DATA_ID_INVALID = 10002,
  /** 验证未接通过 */
  DATA_INVALID = 10003,
  /** 数据未找到 */
  DATA_NOT_FOUND = 10004
}
