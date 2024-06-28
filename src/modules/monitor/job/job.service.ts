import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchJobDto } from './dto/search-job.dto';
import { ApiException, UpdateStateDto, getPaginationRange } from 'src/utility/common';
import { ApiCode, RedisLock } from 'src/utility/enums';
import { SysJob } from './entities/job';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/utility/constant';
import { CronRepeatOptions, EveryRepeatOptions, Queue } from 'bull';
import { RedisService } from 'src/modules/redis/redis.service';
import ms = require('ms');
import { TASK } from 'src/utility/decorator';
import { ModuleRef, Reflector } from '@nestjs/core';

@Injectable()
export class JobService implements OnModuleInit {
  private readonly logger = new Logger(JobService.name);
  constructor(
    @InjectRepository(SysJob)
    private jobRepository: Repository<SysJob>,

    @InjectQueue(QUEUE_NAME)
    private queue: Queue,

    private redisService: RedisService,

    private moduleRef: ModuleRef,
    private reflector: Reflector
  ) {}

  onModuleInit() {
    this.initTask();
  }

  async create(createJobDto: CreateJobDto) {
    const job = await this.jobRepository.findOneBy({
      name: createJobDto.name
    });
    if (job) throw new ApiException('任务名称已存在', ApiCode.DATA_INVALID);

    const result = await this.jobRepository.save(createJobDto);
    await this.start(result);
  }

  async update(updateJobDto: UpdateJobDto) {
    const job = await this.findOne(updateJobDto.id);

    const existJob = await this.jobRepository.findOneBy({
      id: Not(updateJobDto.id),
      name: updateJobDto.name
    });

    if (existJob) throw new ApiException('任务名称已存在', ApiCode.DATA_INVALID);
    const result = await this.jobRepository.update(updateJobDto.id, {
      ...updateJobDto
    });
    if (result.affected === 0) {
      throw new ApiException('操作失败', ApiCode.DATA_ID_INVALID);
    }

    // 立即执行
    if (updateJobDto.immediate === 1) {
      this.once(updateJobDto.id);
    }

    const temp = await this.findOne(updateJobDto.id);

    if (job.status === 0) {
      await this.stop(temp);
    } else if (job.status === 1) {
      await this.start(temp);
    }

    return result;
  }

  async findOne(id: number) {
    const result = await this.jobRepository.findOneBy({ id });
    if (!result) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);
    return result;
  }

  async findAll() {
    return this.jobRepository.find({
      where: {
        status: 1
      },
      select: ['id', 'cron', 'name', 'service', 'params', 'startTime', 'endTime']
    });
  }

  async remove(id: number) {
    const res = await this.jobRepository.softDelete({ id });
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    return res;
  }

  async list(query: SearchJobDto) {
    const where: FindOptionsWhere<SysJob> = {};
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.status) {
      where.status = query.status;
    }

    const [user, count] = await this.jobRepository.findAndCount({
      ...getPaginationRange(query),
      where,
      order: {
        id: 'desc'
      }
    });

    return {
      total: count,
      data: user
    };
  }

  async updateStatus(updateStateDto: UpdateStateDto) {
    const job = await this.findOne(updateStateDto.id);
    if (updateStateDto.status === 0) {
      await this.stop(job);
    } else if (updateStateDto.status === 1) {
      await this.start(job);
    }
    return true;
  }

  /** 更新是否已经完成，完成则移除该任务并修改状态 */
  async updateTaskCompleteStatus(id: number) {
    const jobs = await this.getRepeatableJobs();
    const task = await this.findOne(id);
    this.jobRepository.update(id, { lastExecTime: new Date() });
    // 如果下次执行时间小于当前时间，则表示已经执行完成。
    for (const job of jobs) {
      const currentTime = new Date().getTime();
      if (job.id === id.toString() && job.next < currentTime) {
        // 如果下次执行时间小于当前时间，则表示已经执行完成。
        await this.stop(task);
        break;
      }
    }
  }

  /** 执行任务 */
  async callService(serviceName: string, params?: string) {
    if (!serviceName) return;
    const arr = serviceName.split('.');
    const className = await this.moduleRef.get(arr[0], { strict: false });
    const methodName = arr[1];

    const hasJobDecorator = this.reflector.get<boolean>(TASK, className.constructor);
    if (!hasJobDecorator) {
      this.logger.error('该任务没有TASK装饰器');
      throw new Error('该任务没有TASK装饰器');
    }

    if (!className || !(methodName in className)) {
      this.logger.error(`该任务没有${methodName}方法`);
      throw new Error(`该任务没有${methodName}方法`);
    }
    if (!params) {
      await className[methodName]();
    } else {
      // 参数安全判断
      const parseArgs = this.safeParse(params);

      if (Array.isArray(parseArgs)) {
        // 数组形式则自动扩展成方法参数回调
        await className[methodName](...parseArgs);
      } else {
        await className[methodName](parseArgs);
      }
    }
  }

  private safeParse(args: string): unknown | string {
    try {
      return JSON.parse(args);
    } catch (e) {
      return args;
    }
  }

  /** 初始化任务 */
  private async initTask() {
    const result = await this.redisService.lock(RedisLock.queue, ms('30min'));
    if (result[0][1] === 0) {
      // 存在锁则直接跳过防止重复初始化
      this.logger.warn('Init task is lock', JobService.name);
      return;
    }

    // 移出存在的任务
    await this.stop();

    // 查询所有任务
    const jobs = await this.findAll();
    for (const t of jobs) {
      await this.start(t);
    }

    // 启动后释放锁
    await this.redisService.unlock(RedisLock.queue);
  }

  /** 手动执行任务  */
  async once(id: number) {
    const job = await this.findOne(id);
    if (job) {
      await this.queue.add(
        { id: job.id, name: job.name, service: job.service, args: job.params },
        { jobId: job.id, removeOnComplete: true, removeOnFail: true }
      );
    }
    return true;
  }

  /** 启动任务 */
  private async start(job: SysJob) {
    await this.stop(job);
    const repeat: CronRepeatOptions | EveryRepeatOptions = {
      cron: job.cron
    };

    if (job.startTime) {
      repeat.startDate = job.startTime;
    }
    if (job.endTime) {
      repeat.endDate = job.endTime;
    }

    const task = await this.queue.add(
      { id: job.id, name: job.name, service: job.service, params: job.params },
      { jobId: job.id, removeOnComplete: true, removeOnFail: true, repeat }
    );
    if (task && task.opts) {
      // 成功
      await this.jobRepository.update(job.id, {
        status: 1
      });
    } else {
      // 失败
      task && (await task.remove());
      this.logger.error(`任务：${job.name}执行失败`);
      await this.jobRepository.update(job.id, { status: 0 });
    }
  }

  /** 停止任务,如果传递了 任务信息，则只停止该任务，否则停止所有任务 */
  private async stop(job?: SysJob) {
    const repeatableJobs = await this.getRepeatableJobs();
    for (let i = 0; i < repeatableJobs.length; i++) {
      if (job) {
        if (job.id.toString() === repeatableJobs[i].id.toString()) {
          await this.queue.removeRepeatableByKey(repeatableJobs[i].key);
        }
      } else {
        await this.queue.removeRepeatableByKey(repeatableJobs[i].key);
      }
    }
    if (job && repeatableJobs.length > 0) {
      await this.jobRepository.update(job.id, { status: 0 });
    }
  }
  private getRepeatableJobs() {
    return this.queue.getRepeatableJobs();
  }
}
