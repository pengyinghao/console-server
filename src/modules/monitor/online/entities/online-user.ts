/** 在线用户 */
export interface OnlineUser {
  uuid: string;
  /** 账号 */
  account: string;
  /** 名称 */
  name: string;
  /** 角色 */
  role: string;
  /** 登录地址 */
  loginAddr: string;
  /** 登录ip */
  loginIp: string;
  /** 登录时间 */
  loginTime: Date;
  /** 登录系统 */
  os: string;
  /** 浏览器版本 */
  browser: string;
}
