import { IsEnum, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';
import { Status } from 'src/utility/enums';
import { ruleHelper } from 'src/utility/common';

export class CreateDictTypeDto {
  /** 编号 */
  @MaxLength(20, { message: '编号最大长度为20' })
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `编号${ruleHelper.unable_contain_special.message}`
  })
  @IsNotEmpty({ message: '编号不能为空' })
  no: string;

  /** 类型名称 */
  @MaxLength(20, { message: '类型名称最大长度为20' })
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `类型名称${ruleHelper.unable_contain_special.message}`
  })
  @IsNotEmpty({ message: '类型名称不能为空' })
  name: string;

  @IsNotEmpty({ message: '状态不能为空' })
  @IsEnum(Status, { message: '状态不正确' })
  status: Status;

  @MaxLength(200, { message: '备注最大长度为200' })
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `备注${ruleHelper.unable_contain_special.message}`
  })
  @IsOptional()
  remark?: string;
}
