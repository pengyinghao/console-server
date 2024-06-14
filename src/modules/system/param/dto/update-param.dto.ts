import { PartialType } from '@nestjs/mapped-types';
import { CreateParamDto } from './create-param.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateParamDto extends PartialType(CreateParamDto) {
  @IsNotEmpty({ message: '数据id不能为空' })
  id: number;
}
