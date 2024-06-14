import { RoleEnum } from 'src/modules/system/role/enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity({ name: 'sys_role', comment: '角色信息' })
export class SysRole {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  /** 角色名称 */
  @Column({ length: 20, comment: '角色名称' })
  name: string;

  /** 角色标识 */
  @Column({ length: 50, comment: '角色标识' })
  code: string;

  /**  默认导航地址 */
  @Column({ length: 100, comment: '默认导航地址', nullable: true })
  defaultNavigate?: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    comment: '类型',
    default: 'custom'
  })
  type: RoleEnum;

  /** 角色描述 */
  @Column({ length: 200, comment: '角色描述', nullable: true })
  remark: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time', comment: '更新时间' })
  updateTime: Date;
}
