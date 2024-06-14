import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobDto } from './dto/search-job.dto';
import { DataResult, UpdateStateDto } from 'src/utility/common';

@Controller('monitor/job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    await this.jobService.create(createJobDto);
    return DataResult.ok();
  }

  @Post('once/:id')
  async once(@Param('id') id: string) {
    await this.jobService.once(+id);
    return DataResult.ok('执行成功');
  }

  /** 分页查询定时表达式 */
  @Get('list')
  async list(@Query() query: SearchJobDto) {
    const res = await this.jobService.list(query);
    return DataResult.ok(res);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.jobService.findOne(+id);
    return DataResult.ok(res);
  }

  @Put()
  async update(@Body() updateJobDto: UpdateJobDto) {
    const res = await this.jobService.update(updateJobDto);
    return DataResult.ok(res);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(+id);
  }

  @Post('status')
  async status(@Body() updateStateDto: UpdateStateDto) {
    await this.jobService.updateStatus(updateStateDto);
    return DataResult.ok();
  }
}
