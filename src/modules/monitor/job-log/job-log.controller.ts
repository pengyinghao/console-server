import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { JobLogService } from './job-log.service';
import { CreateJobLogDto } from './dto/create-job-log.dto';
import { DataResult } from 'src/utility/common';
import { SearchJobLogDto } from './dto/search-job-log.dto';

@Controller('/monitor/job-log')
export class JobLogController {
  constructor(private readonly jobLogService: JobLogService) {}

  @Post()
  create(@Body() createJobLogDto: CreateJobLogDto) {
    return this.jobLogService.create(createJobLogDto);
  }

  @Get('list')
  async list(@Query() query: SearchJobLogDto) {
    const res = await this.jobLogService.list(query);
    return DataResult.ok(res);
  }
}
