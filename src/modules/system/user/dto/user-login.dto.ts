import { IsNotEmpty, Length } from 'class-validator';

/** 用户登录实体 */
export class UserLoginDto {
  /** 账号 */
  @Length(5, 20, { message: '账号长度为5-20位' })
  @IsNotEmpty({ message: '账号不能为空' })
  account: string;
  /** 密码 */
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  /** 验证码 */
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
  @IsNotEmpty({ message: 'uuid不能为空' })
  uuid: string;
}
