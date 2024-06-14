export class CreateLoginLogDto {
  /** 用户名 */
  account: string;
  /** 登录ip */
  loginIp: string;
  /** 登录地址*/
  loginAddr: string;
  /** 登录时间 */
  loginTime: Date;
  /** 浏览器 */
  browser: string;
  /** 操作系统 */
  os: string;
  /** 登录状态 */
  status: number;
  /** 消息 */
  message: string;
}
