import { Injectable } from '@nestjs/common';
import { RedisCache } from 'src/utility/enums';
import { RedisService } from 'src/modules/redis/redis.service';
import { SearchOnlineDto } from './dto/search-online.dto';
import { OnlineUser } from 'src/modules/monitor/online/entities/online-user';
import { getPaginationRange } from 'src/utility/common';

@Injectable()
export class OnlineService {
  constructor(private redisService: RedisService) {}
  async list(query: SearchOnlineDto) {
    let result = await this.redisService.getInfos<OnlineUser>(`${RedisCache.USER_LOGIN}*`);

    const { take, skip } = getPaginationRange(query);
    if (query.name) result = result.filter((item) => item.name.includes(query.name));
    if (query.account) result = result.filter((item) => item.account.includes(query.account));
    if (query.loginAddr) result = result.filter((item) => item.loginAddr.includes(query.loginAddr));
    const total = result.length;
    const data = result.slice(skip, skip + take);
    return {
      data: data,
      total: total
    };
  }
}
