import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'sys_user', comment: '用户信息' })
export class SysUser {
  /** id */
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  /** 状态 */
  @Column({
    type: 'tinyint',
    comment: '状态(0:禁用,1:启用 )',
    default: 1
  })
  status: number;

  /** 编号 */
  @Column({ length: 20, comment: '编号' })
  no: string;

  /** 姓名 */
  @Column({ length: 20, comment: '姓名' })
  name: string;

  /** 账号 */
  @Column({ length: 20, comment: '账号' })
  account: string;

  /** 密码 */
  @Exclude()
  @Column({ length: 300, comment: '密码' })
  password: string;

  /** 手机号码 */
  @Column({ length: 11, comment: '手机号码', nullable: true })
  phone: string;

  /** 是否冻结 */
  @Column({ comment: '是否冻结（0：未冻结,1：冻结）', type: 'tinyint', default: 0 })
  freeze: number;

  @Column({
    comment: '是否系统用户（0：是,1：否）',
    name: 'sys_user',
    type: 'tinyint',
    default: 1
  })
  sysUser: number;

  /** 邮箱 */
  @Column({ length: 30, comment: '邮箱', nullable: true })
  email?: string;

  /** 地址 */
  @Column({ length: 200, comment: '地址', nullable: true })
  address?: string;

  /** 头像 */
  @Column({ length: 200, comment: '头像', nullable: true })
  avatar?: string;

  /** 角色id */
  @Column({ comment: '角色id', default: 0 })
  roleId: number;

  /** 角色名称 */
  @Column({ comment: '角色名称', length: 20 })
  roleName: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'delete_time', comment: '删除时间', nullable: true })
  deleteTime?: Date;
}
