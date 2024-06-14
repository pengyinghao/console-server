import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { DictTypeService } from './dict-type.service';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';
import { DataResult } from 'src/utility/common/data.result';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { DictTypeListSearchDto } from './dto/dict-type-list-search.dto';
import { UpdateStateDto } from 'src/utility/common/dto/update-status.dto';
import { LogRecordAction, LogRecordController } from 'src/utility/decorator';

@Controller('system/dict_type')
@LogRecordController('字典类型')
export class DictTypeController {
  constructor(private readonly dictTypeService: DictTypeService) {}

  /** 查询所有字典 */
  @Get('all')
  async findAll() {
    const res = await this.dictTypeService.findAll();
    return DataResult.ok(res);
  }

  /** 创建字典类型 */
  @Post()
  @LogRecordAction('创建字典类型')
  async create(@Body() dictTypeDto: CreateDictTypeDto) {
    await this.dictTypeService.create(dictTypeDto);
    return DataResult.ok();
  }

  /** 修改字典类型状态 */
  @Put('status')
  @LogRecordAction('修改字典类型状态', 'update')
  async updateDictTypeState(@Body() { id, status }: UpdateStateDto) {
    await this.dictTypeService.updateDictTypeState(id, status);
    return DataResult.ok();
  }

  /** 修改字典类型 */
  @Put(':id')
  @LogRecordAction('修改字典类型', 'update')
  async updateDictType(@Param('id') id: number, @Body() dictType: UpdateDictTypeDto) {
    await this.dictTypeService.update(id, dictType);
    return DataResult.ok();
  }

  /** 删除字典类型 */
  @Delete(':id')
  @LogRecordAction('删除字典类型', 'delete')
  async deleteDictType(@Param('id') id: number) {
    await this.dictTypeService.delete(id);
    return DataResult.ok();
  }

  /** 查询字典类型详情 */
  @Get(':id')
  async getDictDetail(@Param('id') id: number) {
    const res = await this.dictTypeService.findById(id);
    return DataResult.ok(res);
  }

  /** 查询分页数据 */
  @Get()
  async pageDictType(@Query() query: DictTypeListSearchDto): Promise<DataResult<PagingResponse>> {
    const res = await this.dictTypeService.pageData(query);
    return DataResult.ok(res);
  }
}
