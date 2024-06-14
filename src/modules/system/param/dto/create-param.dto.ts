import { IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';
import { ruleHelper } from 'src/utility/common';

export class CreateParamDto {
  /** 参数名称 */
  @MaxLength(20, { message: '参数名称长度不能超过20' })
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `参数名称${ruleHelper.unable_contain_special.message}`
  })
  @IsNotEmpty({ message: '参数名称不能为空' })
  name: string;

  @MaxLength(50, { message: '参数键长度不能超过50' })
  @Matches(ruleHelper.only_letter_dot.reg, {
    message: `参数键${ruleHelper.only_letter_dot.message}`
  })
  @IsNotEmpty({ message: '参数键不能为空' })
  label: string;

  @MaxLength(50, { message: '参数值长度不能超过50' })
  @IsNotEmpty({ message: '参数值不能为空' })
  value: string;

  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `参数名称${ruleHelper.unable_contain_special.message}`
  })
  @MaxLength(200, { message: '备注长度不能超过200' })
  @IsOptional()
  remark?: string;
}
