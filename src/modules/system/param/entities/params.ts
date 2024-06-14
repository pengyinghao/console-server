import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_param', comment: '参数设置' })
export class SysParams {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 20, comment: '参数名称' })
  name: string;

  @Column({ length: 50, comment: '参数键' })
  label: string;

  @Column({ length: 50, comment: '参数值' })
  value: string;

  @Column({
    type: 'tinyint',
    comment: '是否系统内置(0：是,1：否)',
    default: 1
  })
  sys: number;

  @Column({ length: 200, comment: '备注', nullable: true })
  remark?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time', comment: '更新时间' })
  updateTime: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'delete_time', comment: '删除时间', nullable: true })
  deleteTime?: Date;
}
