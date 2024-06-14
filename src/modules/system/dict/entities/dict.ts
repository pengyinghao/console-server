import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sys_dict', comment: '字典信息' })
export class SysDict {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  /** 字典名称 */
  @Column({ length: 20, comment: '字典名称' })
  name: string;

  /** 状态 */
  @Column({
    type: 'tinyint',
    comment: '状态(0:禁用,1:启用 )',
    default: 1
  })
  status: number;

  /** 字典值 */
  @Column({ length: 20, comment: '字典值' })
  value: string;

  /** 显示顺序 */
  @Column({ comment: '显示顺序' })
  sort: number;

  @Column({ comment: '字典类型id', name: 'type_id' })
  typeId: number;

  /** 备注 */
  @Column({ length: 100, comment: '备注', nullable: true })
  remark?: string;
}
