import { IsNotEmpty, IsOptional, Length, Matches, MaxLength } from 'class-validator';
import { ruleHelper } from 'src/utility/common';

export class CreateRoleDto {
  /** 角色标识 */
  @Matches(ruleHelper.only_eng_udl.reg, {
    message: `角色标识${ruleHelper.only_eng_udl.message}`
  })
  @MaxLength(50, { message: '角色标识最大长度为50' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  code: string;

  /** 角色名称 */
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `角色名称${ruleHelper.unable_contain_special.message}`
  })
  @Length(2, 20, { message: '角色名称长度为2-20' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  /** 角色描述 */
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `角色描述${ruleHelper.unable_contain_special.message}`
  })
  @MaxLength(200, { message: '角色描述最大长度为200' })
  @IsOptional()
  remark?: string;
}
