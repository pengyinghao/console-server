export class CreateJobLogDto {
  /** 任务id */
  jobId: number;
  /** 任务名称 */
  jobName: string;
  /** 执行状态（0：失败, 1：成功） */
  status: number;
  /** 错误日志 */
  err?: string;
  /** 消耗时间 */
  consumeTime: number;
}
