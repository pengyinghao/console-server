import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_role_menu', { comment: '角色菜单授权' })
export class SysRoleMenu {
  /** id */
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'role_id', comment: '角色id', default: 0 })
  public roleId: number;

  @Column({ name: 'menu_id', comment: '菜单id', default: 0 })
  public menuId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;
}
