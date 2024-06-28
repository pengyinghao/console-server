import { Injectable } from '@nestjs/common';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchLoginLogDto } from './dto/search-login-info-dto';
import { getPaginationRange } from 'src/utility/common';
import { SysLoginLog } from './entities/login-log';
import useragent = require('useragent');
import { Request } from 'express';
import requestIp = require('request-ip');
import { HttpService } from 'src/modules/http/http.service';
import { LoginStatus } from './enums/login.status.enum';

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(SysLoginLog)
    private repository: Repository<SysLoginLog>,
    private httpService: HttpService
  ) {}

  async create({ code, msg, request }: { code: LoginStatus; msg: string; request: Request }) {
    const userAgent = useragent.parse(request.headers['user-agent']);
    const clientIp = requestIp.getClientIp(request) || request.ip;
    const { addr, ip } = await this.httpService.ipToCity(clientIp);
    const loginLog = new SysLoginLog();
    loginLog.account = request.body.account;
    loginLog.loginIp = ip;
    loginLog.loginAddr = addr;
    loginLog.browser = userAgent.toAgent();
    loginLog.os = userAgent.os.toString();
    loginLog.loginTime = new Date();
    loginLog.status = code;
    loginLog.message = msg;
    this.repository.save(loginLog);
  }

  async list(query: SearchLoginLogDto) {
    const where: FindOptionsWhere<SysLoginLog> = {};
    if (query.account) {
      where.account = Like(`%${query.account}%`);
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.startTime && query.endTime) {
      where.loginTime = Between(new Date(query.startTime), new Date(`${query.endTime} 23:59:59`));
    }

    const [data, count] = await this.repository.findAndCount({
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
