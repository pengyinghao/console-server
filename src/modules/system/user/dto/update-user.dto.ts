import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends IntersectionType(PartialType(CreateUserDto), OmitType(CreateUserDto, ['password', 'avatar'])) {
  @IsNotEmpty({ message: '数据id不能为空' })
  id: number;
}
