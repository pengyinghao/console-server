import { Module } from '@nestjs/common';
import { JobLogService } from './job-log.service';
import { JobLogController } from './job-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import SysJobLog from './entities/job-log';

@Module({
  imports: [TypeOrmModule.forFeature([SysJobLog])],
  controllers: [JobLogController],
  providers: [JobLogService]
})
export class JobLogModule {}
