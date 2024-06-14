import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'sys_dict_type', comment: '字典类型' })
export class SysDictType {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  /** 编号 */
  @Column({ length: 20, comment: '编号' })
  no: string;

  /** 类型名称 */
  @Column({ length: 20, comment: '类型名称' })
  name: string;

  /** 状态 */
  @Column({
    type: 'tinyint',
    comment: '状态(0:禁用,1:启用 )',
    default: 1
  })
  status: number;

  @Column({ length: 200, comment: '备注', nullable: true })
  remark?: string;
}
