import { IsNotEmpty, Length, MaxLength, IsOptional, Matches } from 'class-validator';
import { IsEmail } from 'src/utility/decorator/is.email.decorator';
import { IsPhone } from 'src/utility/decorator/is.phone.decorator';
import { ruleHelper } from 'src/utility/common';

export class CreateUserDto {
  /** 编号 */
  @Matches(ruleHelper.only_alphanumeric_underline.reg, {
    message: `编号${ruleHelper.only_alphanumeric_underline.message}`
  })
  @MaxLength(20, { message: '编号超度不能超过20' })
  @IsNotEmpty({ message: '编号不能为空' })
  no: string;

  /** 姓名 */
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `姓名${ruleHelper.unable_contain_special.message}`
  })
  @Length(2, 20, { message: '姓名长度为2-20' })
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  /** 账号 */
  @Matches(ruleHelper.only_alphanumeric_underline.reg, {
    message: `账号${ruleHelper.only_alphanumeric_underline.message}`
  })
  @Length(5, 20, { message: '账号长度为5-20' })
  @IsNotEmpty({ message: '账号不能为空' })
  account: string;

  /** 密码 */
  @Matches(ruleHelper.password.reg, {
    message: ruleHelper.password.message
  })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  /** 手机号码 */
  @IsPhone()
  @IsNotEmpty({ message: '手机号码不能为空' })
  phone: string;

  @IsNotEmpty({ message: '角色不能为空' })
  /** 角色 */
  roleId: number;

  /** 角色名称 */
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `角色名称${ruleHelper.unable_contain_special.message}`
  })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @MaxLength(20, { message: '角色名称最大长度为20' })
  roleName: string;

  /** 邮箱 */
  @IsOptional()
  @IsEmail()
  email?: string;

  /** 地址 */
  @IsOptional()
  @MaxLength(200, { message: '地址最大长度为200' })
  address?: string;

  /** 头像 */
  @IsOptional()
  @MaxLength(200, { message: '头像地址最大长度为200' })
  avatar?: string;
}
