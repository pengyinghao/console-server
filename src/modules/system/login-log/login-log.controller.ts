import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LoginLogService } from './login-log.service';
import { CreateLoginLogDto } from './dto/create-login-info.dto';
import { SearchLoginLogDto } from './dto/search-login-info-dto';
import { DataResult } from 'src/utility/common';

@Controller('system/login-log')
export class LoginLogController {
  constructor(private readonly loginInfoService: LoginLogService) {}

  @Post()
  create(@Body() createLoginLogDto: CreateLoginLogDto) {
    return this.loginInfoService.create(createLoginLogDto);
  }

  @Get('list')
  async list(@Query() query: SearchLoginLogDto) {
    const res = await this.loginInfoService.list(query);
    return DataResult.ok(res);
  }
}
