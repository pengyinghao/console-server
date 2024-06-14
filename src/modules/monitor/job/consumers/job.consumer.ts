import { JobService } from 'src/modules/monitor/job/job.service';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAME } from 'src/utility/constant';
import { JobLogService } from '../../job-log/job-log.service';

export interface ExecuteData {
  id: number;
  name: string;
  params?: string;
  service: string;
}

/** 定时任务消费 */
@Processor(QUEUE_NAME)
export class JobConsumer {
  private readonly logger = new Logger(JobConsumer.name);
  constructor(private jobService: JobService, private jobLogService: JobLogService) {}
  @Process()
  async handler(job: Job<ExecuteData>) {
    const startTime = Date.now();
    const { data } = job;

    // 状态
    let status = 0;
    // 错误消息
    let err = '';
    try {
      const service = data.service;
      if (!service) return;
      await this.jobService.callService(service, data.params); // 执行任务
      status = 1;
    } catch (e) {
      status = 0;
      err = e;
      this.logger.error(e);
    } finally {
      this.jobLogService.create({
        jobId: data.id,
        jobName: data.name,
        status: status,
        consumeTime: Date.now() - startTime,
        err: err
      });
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job<ExecuteData>) {
    this.jobService.updateTaskCompleteStatus(job.data.id);
  }
}
