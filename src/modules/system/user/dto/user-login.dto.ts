/** 用户登录实体 */
export class UserLoginDto {
  account: string;
  /** 密码 */
  password: string;
  /** 验证码 */
  code: string;
  uuid: string;
}
