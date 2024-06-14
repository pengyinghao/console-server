import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Status } from 'src/utility/enums/status.enum';

export class CreateDictDto {
  /** 字典名称 */
  @IsNotEmpty({ message: '字典名称不能为空' })
  @MaxLength(20, { message: '字典名称最大长度为20' })
  name: string;

  /** 状态(0:禁用，1:启用) */
  @IsNotEmpty({ message: '状态不能为空' })
  @IsEnum(Status, { message: '状态不正确' })
  status: Status;

  /** 字典值 */
  @IsNotEmpty({ message: '字典值不能为空' })
  @MaxLength(20, { message: '字典值最大长度为20' })
  value: string;

  /** 显示顺序 */
  @IsNotEmpty({ message: '显示顺序不能为空' })
  sort: number;

  @IsNotEmpty({ message: '字典类型id不能为空' })
  typeId: number;

  /** 备注 */
  @IsOptional()
  @MaxLength(200, { message: '备注最大长度为200' })
  remark?: string;
}
