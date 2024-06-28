import { RedisService } from 'src/modules/redis/redis.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateParamDto } from './dto/create-param.dto';
import { UpdateParamDto } from './dto/update-param.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode, RedisCache } from 'src/utility/enums';
import { SearchParamsPageDto } from './dto/search-param-page.dto';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { getPaginationRange } from 'src/utility/common';
import { SysParams } from './entities/params';

@Injectable()
export class ParamService implements OnModuleInit {
  constructor(
    @InjectRepository(SysParams)
    private readonly paramsRepository: Repository<SysParams>,
    private readonly redisService: RedisService
  ) {}

  async onModuleInit() {
    this.cacheParams();
  }

  /** 缓存系统参数 */
  async cacheParams() {
    const result = await this.findAll();
    this.redisService.set(RedisCache.SYS_PARAMS, result);
  }

  async create(createParamDto: CreateParamDto) {
    const existingParam = await this.paramsRepository.findOneBy({
      label: createParamDto.label
    });
    if (existingParam) {
      throw new ApiException('参数键已存在', ApiCode.DATA_INVALID);
    }

    await this.paramsRepository.save(createParamDto);
    this.cacheParams();
    return true;
  }

  async findDetail(id: number) {
    const param = await this.paramsRepository.findOne({
      where: { id },
      select: ['id', 'label', 'name', 'value', 'remark']
    });
    if (!param) {
      throw new ApiException('参数不存在', ApiCode.DATA_ID_INVALID);
    }
    return param;
  }

  async findOne(label: string) {
    const param = await this.paramsRepository.findOne({
      where: { label },
      select: ['id', 'label', 'name', 'value', 'remark']
    });
    if (!param) {
      throw new ApiException('参数不存在', ApiCode.DATA_ID_INVALID);
    }
    return param;
  }

  async update(updateParamDto: UpdateParamDto) {
    const existingParam = await this.paramsRepository.findOneBy({
      id: updateParamDto.id
    });
    if (!existingParam) {
      throw new ApiException('参数记录不存在', ApiCode.DATA_ID_INVALID);
    }

    const updateResult = await this.paramsRepository.update(updateParamDto.id, {
      ...updateParamDto
    });
    if (updateResult.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    this.cacheParams();
    return updateResult;
  }

  /** 查询所有系统参数信息 */
  async findAll() {
    const result = await this.paramsRepository.find();
    this.redisService.set(RedisCache.SYS_PARAMS, result);
    return result;
  }

  async remove(id: number) {
    const existingParam = await this.findDetail(id);
    if (!existingParam) {
      throw new ApiException('参数不存在', ApiCode.DATA_ID_INVALID);
    }
    if (existingParam.sys === 0) throw new ApiException('系统默认参数不允许删除', ApiCode.DATA_ID_INVALID);

    const deleteResult = await this.paramsRepository.softDelete({ id });
    if (deleteResult.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    this.cacheParams();
    return deleteResult;
  }

  async page(query: SearchParamsPageDto): Promise<PagingResponse> {
    const where: FindOptionsWhere<SysParams> = {};
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }

    const [data, count] = await this.paramsRepository.findAndCount({
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
