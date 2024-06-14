import { IsArray, IsNotEmpty } from 'class-validator';

export class RoleMenuAuthorizeDto {
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: number;

  @IsNotEmpty({ message: '菜单id不能为空' })
  @IsArray({ message: '菜单id必须为数组' })
  menuIds: number[];

  @IsNotEmpty({ message: '默认当行不能为空' })
  defaultNavigate: string;
}
