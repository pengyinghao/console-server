import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode } from 'src/utility/enums';
import { DictListSearchDto } from './dto/dict-list-search.dto';
import { getPaginationRange } from 'src/utility/common';
import { Status } from 'src/utility/enums/status.enum';
import { SysDict } from './entities/dict';

import { DictTypeService } from '../dict-type/dict-type.service';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(SysDict)
    private dictRepository: Repository<SysDict>,
    private dictTypeService: DictTypeService
  ) {}

  /** 保存 */
  async create(createDictDto: CreateDictDto) {
    const savedDict = await this.dictRepository.save(createDictDto);
    return savedDict;
  }

  /** 修改 */
  async update(id: number, updateDictDto: UpdateDictDto) {
    const dict = await this.dictRepository.findOneBy({ id });
    if (!dict) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);

    const updateResult = await this.dictRepository.update(id, {
      ...updateDictDto
    });
    if (updateResult.affected === 0) {
      throw new ApiException('操作失败', ApiCode.DATA_ID_INVALID);
    }
    return updateResult;
  }

  /** 修改字典状态 */
  async updateState(id: number, status: Status) {
    const dict = await this.dictRepository.findOneBy({ id });
    if (!dict) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);

    const updateResult = await this.dictRepository.update(id, { status });
    if (updateResult.affected === 0) {
      throw new ApiException('操作失败', ApiCode.DATA_ID_INVALID);
    }
    return updateResult;
  }

  /** 删除 */
  async remove(id: number) {
    const dict = await this.dictRepository.findOneBy({ id });
    if (!dict) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);
    if (dict.status === Status.enable) throw new ApiException('已启用的数据不允许删除', ApiCode.DATA_INVALID);

    const deleteResult = await this.dictRepository.delete({ id });
    if (deleteResult.affected === 0) {
      throw new ApiException('操作失败', ApiCode.DATA_ID_INVALID);
    }
    return deleteResult;
  }

  /** 通过id查询 */
  async findById(id: number) {
    const dict = await this.dictRepository.findOneBy({ id });
    if (!dict) throw new ApiException('数据不存在', ApiCode.DATA_ID_INVALID);
    return dict;
  }

  /** 通过字典类型id删除字典信息 */
  async deleteByTypeId(typeId: number) {
    const deleteResult = await this.dictRepository.delete({ typeId });
    if (deleteResult.affected === 0) {
      throw new ApiException('操作失败', ApiCode.DATA_ID_INVALID);
    }
    return deleteResult;
  }

  /** 通过字典类型编号 查询字典信息 */
  async findByTypeNo(typeNo: string) {
    const dictType = await this.dictTypeService.findByNo(typeNo);

    return await this.dictRepository
      .createQueryBuilder()
      .select(['id', 'name as label', 'value'])
      .where('type_id = :typeId', { typeId: dictType.id })
      .andWhere('status="enable"')
      .orderBy('sort', 'ASC')
      .getRawMany();
  }

  /** 分页查询字典类型 */
  async pageData(query: DictListSearchDto) {
    const where: FindOptionsWhere<SysDict> = {};
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.typeId) where.typeId = query.typeId;

    const [data, count] = await this.dictRepository.findAndCount({
      ...getPaginationRange(query),
      where
    });
    return { total: count, data };
  }
}
