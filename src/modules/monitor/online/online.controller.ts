import { Controller, Get, Query } from '@nestjs/common';
import { OnlineService } from './online.service';
import { SearchOnlineDto } from './dto/search-online.dto';
import { DataResult } from 'src/utility/common';

@Controller('monitor/online')
export class OnlineController {
  constructor(private readonly onlineService: OnlineService) {}

  @Get('list')
  async list(@Query() query: SearchOnlineDto) {
    const res = await this.onlineService.list(query);
    return DataResult.ok(res);
  }
}
