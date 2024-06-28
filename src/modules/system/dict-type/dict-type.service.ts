import { Injectable } from '@nestjs/common';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { EntityManager, FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/utility/common/api.exception';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { DictTypeListSearchDto } from './dto/dict-type-list-search.dto';
import { getPaginationRange } from 'src/utility/common';
import { Status, ApiCode } from 'src/utility/enums';
import { SysDictType } from './entities/dict-type';
import { DictService } from '../dict/dict.service';

@Injectable()
export class DictTypeService {
  @InjectRepository(SysDictType)
  private readonly dictTypeRepository: Repository<SysDictType>;
  private dictService: DictService;
  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {}

  /** 创建字典类型 */
  async create(dictTypeDto: CreateDictTypeDto) {
    const foundDictType = await this.dictTypeRepository.findOneBy({
      no: dictTypeDto.no
    });
    if (foundDictType) throw new ApiException('编号已存在', ApiCode.DATA_INVALID);

    return await this.dictTypeRepository.save(dictTypeDto);
  }

  /** 修改字典类型 */
  async update(id: number, dictTypeDto: UpdateDictTypeDto) {
    const dictType = await this.dictTypeRepository.findOneBy({ id });
    if (!dictType) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);

    const existDictType = await this.dictTypeRepository.findOneBy({
      no: dictTypeDto.no,
      id: Not(id)
    });
    if (existDictType) throw new ApiException('编号已存在', ApiCode.DATA_INVALID);

    const res = await this.dictTypeRepository.update(id, dictTypeDto);
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.DATA_ID_INVALID);
    }
    return res;
  }

  /** 更新字典类型状态 */
  async updateDictTypeState(id: number, status: Status) {
    const dictType = await this.dictTypeRepository.findOneBy({ id });
    if (!dictType) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);

    const res = await this.dictTypeRepository.update(id, { status });
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.DATA_ID_INVALID);
    }
    return res;
  }

  /** 删除字典类型 */
  async delete(id: number) {
    const dictType = await this.dictTypeRepository.findOneBy({ id });
    if (!dictType) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);
    if (dictType.status === Status.enable) throw new ApiException('启用的数据不允许删除', ApiCode.DATA_INVALID);

    await this.entityManager.transaction(async () => {
      await this.dictService.deleteByTypeId(id);
      await this.dictTypeRepository.delete({ id });
    });
  }

  /** 通过字典编号查询字典信息 */
  async findByNo(no: string) {
    const dictType = await this.dictTypeRepository.findOneBy({ no: no });
    if (!dictType) throw new ApiException('字典类型不存在', ApiCode.DATA_ID_INVALID);
    return dictType;
  }

  /** 查询字典详情 */
  async findById(id: number) {
    const dictType = await this.dictTypeRepository.findOneBy({ id });
    if (!dictType) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);
    return dictType;
  }

  /** 查询所有字典类型 */
  async findAll() {
    return await this.dictTypeRepository.find({
      select: ['id', 'name', 'no']
    });
  }

  /** 分页查询字典类型 */
  async pageData(query: DictTypeListSearchDto): Promise<PagingResponse> {
    const where: FindOptionsWhere<SysDictType> = {};
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.no) {
      where.no = Like(`%${query.no}%`);
    }
    const [data, count] = await this.dictTypeRepository.findAndCount({
      ...getPaginationRange(query),
      where
    });

    return {
      total: count,
      data: data
    };
  }
}
