import { Injectable } from '@nestjs/common';
import { CreateJobLogDto } from './dto/create-job-log.dto';
import SysJobLog from './entities/job-log';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchJobLogDto } from './dto/search-job-log.dto';
import { getPaginationRange } from 'src/utility/common';

@Injectable()
export class JobLogService {
  @InjectRepository(SysJobLog)
  private jobLogRepository: Repository<SysJobLog>;

  create(createJobLogDto: CreateJobLogDto) {
    return this.jobLogRepository.save(createJobLogDto);
  }

  async list(query: SearchJobLogDto) {
    const where: FindOptionsWhere<SysJobLog> = {
      ...(query.jobName ? { jobName: Like(`%${query.jobName}%`) } : null),
      ...(query.status ? { status: query.status } : null)
    };

    const [data, count] = await this.jobLogRepository.findAndCount({
      ...getPaginationRange(query),
      where,
      order: {
        id: 'desc'
      }
    });

    return {
      total: count,
      data: data
    };
  }
}
