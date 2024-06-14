import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Status } from 'src/utility/enums/status.enum';

export class CreateMenuDto {
  /** 状态(0：禁用，1：启用) */
  @IsNotEmpty({ message: '状态不能为空' })
  status: Status;

  @IsNotEmpty({ message: '菜单名称不能为空' })
  @MaxLength(20, { message: '菜单名称最大长度为20' })
  /** 菜单名称 */
  name: string;

  /** 图标 */
  @IsOptional()
  @MaxLength(50, { message: '菜单图标最大长度为50' })
  icon?: string;

  /** 打开方式(0：路由，1：内嵌，2：链接) */
  @IsNotEmpty({ message: '打开方式不能为空' })
  openType: number;

  /** 菜单类型(0：目录，1：菜单，2：按钮) */
  @IsNotEmpty({ message: '菜单类型不能为空' })
  type: number;

  @IsOptional()
  @MaxLength(200, { message: '功能代码最大长度为50' })
  code?: string;

  /** 上级菜单 */
  @IsOptional()
  parentId?: number;

  /** 显示顺序 */
  @IsNotEmpty({ message: '显示顺序不能为空' })
  sort: number;

  /** 显示状态 */
  @IsNotEmpty({ message: '显示状态不能为空' })
  display: number;

  /** 组件地址 */
  @MaxLength(100, { message: '组件地址最大长度为100' })
  component?: string;

  /** 页面地址 */
  @IsOptional()
  @MaxLength(100, { message: '页面地址最大长度为100' })
  link?: string;

  /** 路由参数 */
  @IsOptional()
  @MaxLength(200, { message: '路由最大长度为200' })
  params?: string;
}
