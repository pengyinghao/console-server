import { Injectable } from '@nestjs/common';
import { CreateLoginLogDto } from './dto/create-login-info.dto';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchLoginLogDto } from './dto/search-login-info-dto';
import { getPaginationRange } from 'src/utility/common';
import { SysLoginLog } from './entities/login-log';

@Injectable()
export class LoginLogService {
  @InjectRepository(SysLoginLog)
  repository: Repository<SysLoginLog>;

  create(createLoginLogDto: CreateLoginLogDto) {
    this.repository.save(createLoginLogDto);
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
