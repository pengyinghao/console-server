import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { SearchLogDto } from './dto/search-log.dto';
import { DataResult } from 'src/utility/common/data.result';

@Controller('system/log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('list')
  async pagination(@Query() query: SearchLogDto) {
    const res = await this.logService.pagination(query);
    return DataResult.ok(res);
  }
}
