import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_menu', comment: '菜单信息' })
export class SysMenu {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  /** 状态 */
  @Column({
    type: 'tinyint',
    comment: '状态(0:禁用,1:启用 )',
    default: 1
  })
  status: number;

  @Column({ comment: '菜单名称', length: 20 })
  name: string;

  @Column({ comment: '菜单图标', length: 50, nullable: true })
  icon?: string;

  /** 菜单类型 */
  @Column({
    type: 'tinyint',
    comment: '菜单类型(0：目录，1：菜单，2：按钮)',
    default: 1
  })
  type: number;

  @Column({ comment: '功能代码', length: 50, nullable: true })
  code?: string;

  @Column({
    type: 'tinyint',
    comment: '打开方式 (0：路由，1：内嵌，2：链接)',
    name: 'open_type',
    default: 0
  })
  openType: number;

  @Column({ comment: '显示顺序' })
  sort: number;

  @Column({ comment: '固定页签(0:固定，1：不固定)', default: 1 })
  fixed: number;

  @Column({
    comment: '上级菜单id',
    default: 0,
    name: 'parent_id',
    nullable: true
  })
  parentId?: number;

  @Column({ comment: '组件地址', length: 100, nullable: true })
  component?: string;

  @Column({ comment: '页面地址', length: 100, nullable: true })
  url?: string;

  /** 显示状态(0：显示，1：隐藏) */
  @Column({
    type: 'tinyint',
    comment: '显示状态(0：显示，1：隐藏)'
  })
  display: number;

  @Column({ comment: '路由参数', length: 200, nullable: true })
  params?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'delete_time', comment: '删除时间', nullable: true })
  deleteTime?: Date;
}
