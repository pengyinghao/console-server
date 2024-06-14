import { IsNotEmpty } from 'class-validator';
import { PagingDto } from 'src/utility/common';

export class RoleUserDto extends PagingDto {
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: number;
}
