import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sys_job_log', comment: '任务执行记录' })
export default class SysJobLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'job_id', comment: '任务id' })
  jobId: number;

  @Column({ name: 'job_name', comment: '任务名称' })
  jobName: string;

  @Column({ type: 'tinyint', default: 0, comment: '执行状态（0：失败, 1：成功）' })
  status: number;

  @Column({ type: 'text', nullable: true, comment: '错误日志' })
  err: string;

  @Column({ type: 'int', nullable: true, name: 'consume_time', default: 0, comment: '消耗时间' })
  consumeTime: number;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;
}
