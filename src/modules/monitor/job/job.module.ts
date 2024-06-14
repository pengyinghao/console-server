import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { SysJob } from './entities/job';
import { JobConsumer } from './consumers/job.consumer';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/utility/constant';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobLogService } from '../job-log/job-log.service';
import SysJobLog from '../job-log/entities/job-log';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysJob, SysJobLog]),
    BullModule.registerQueueAsync({
      name: QUEUE_NAME,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port')
        }
      })
    })
  ],
  controllers: [JobController],
  providers: [JobService, JobLogService, JobConsumer]
})
export class JobModule {}
