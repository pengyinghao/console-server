import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sys_job', comment: '定时任务' })
export class SysJob {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  /** 任务名称 */
  @Column({ length: 20, comment: '任务名称' })
  name: string;

  /** 状态 */
  @Column({
    type: 'tinyint',
    comment: '状态(0:停止,1:运行中 )',
    default: 0
  })
  status: number;

  /** 调用服务 */
  @Column({ length: 100, comment: '调用服务' })
  service: string;

  /** 是否立即执行 */
  @Column({ type: 'tinyint', comment: '是否立即执行（0:否，1:是）', default: 0 })
  immediate: number;

  /** 定时表达式 */
  @Column({ length: 50, comment: '任务表达式' })
  cron: string;

  /** 定时表达式执行参数 */
  @Column({ type: 'text', comment: '定时表达式执行参数', nullable: true })
  params: string;

  /** 任务描述 */
  @Column({ length: 200, comment: '任务描述', nullable: true })
  remark: string;

  /** 开始执行时间 */
  @Column({ type: 'timestamp', comment: '任务开始时间', name: 'start_time', nullable: true })
  startTime?: Date;

  /** 结束执行时间 */
  @Column({ type: 'timestamp', comment: '任务结束时间', name: 'end_time', nullable: true })
  endTime?: Date;

  /** 任务最后执行时间 */
  @Column({
    type: 'timestamp',
    comment: '最后执行时间',
    nullable: true,
    name: 'last_exec_time'
  })
  lastExecTime: Date;
}
