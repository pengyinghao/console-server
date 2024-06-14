import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { SearchLogDto } from './dto/search-log.dto';
import { getPaginationRange } from 'src/utility/common';
import { Between, FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysLog } from './entities/log';

@Injectable()
export class LogService {
  @InjectRepository(SysLog)
  userRepository: Repository<SysLog>;

  async create(logData: CreateLogDto) {
    return this.userRepository.save(logData);
  }

  async pagination(query: SearchLogDto) {
    const where: FindOptionsWhere<SysLog> = {};
    if (query.moduleName) {
      where.moduleName = Like(`%${query.moduleName}%`);
    }
    if (query.actionName) {
      where.actionName = Like(`%${query.actionName}%`);
    }

    if (query.startDate && query.endDate) {
      where['createTime'] = Between(new Date(query.startDate), new Date(`${query.endDate} 23:59:59.999`));
    }

    if (query.actionType) where['actionType'] = query.actionType;
    const [data, total] = await this.userRepository.findAndCount({
      ...getPaginationRange(query),
      where,
      order: {
        id: 'desc'
      }
    });

    return {
      data,
      total
    };
  }
}
