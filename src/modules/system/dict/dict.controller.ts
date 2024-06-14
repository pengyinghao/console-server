import { Controller, Post, Body, Param, Delete, Put, Get, Query } from '@nestjs/common';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { DictListSearchDto } from './dto/dict-list-search.dto';
import { DataResult } from 'src/utility/common/data.result';
import { UpdateStateDto } from 'src/utility/common/dto/update-status.dto';
import { LogRecordAction, LogRecordController } from 'src/utility/decorator';

@Controller('system/dict')
@LogRecordController('字典信息')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  /** 保存字典信息 */
  @Post()
  @LogRecordAction('创建字典信息')
  async create(@Body() createItemDto: CreateDictDto) {
    await this.dictService.create(createItemDto);
    return DataResult.ok();
  }

  /** 修改字典信息 */
  @Put('status')
  @LogRecordAction('更新字典信息状态', 'update')
  async updateState(@Body() { id, status }: UpdateStateDto) {
    await this.dictService.updateState(id, status);
    return DataResult.ok();
  }

  /** 修改字典信息 */
  @Put()
  @LogRecordAction('修改字典信息', 'update')
  async update(@Body() updateItemDto: UpdateDictDto) {
    await this.dictService.update(updateItemDto.id, updateItemDto);
    return DataResult.ok();
  }

  /** 删除字典信息 */
  @Delete(':id')
  @LogRecordAction('删除字典信息', 'delete')
  async remove(@Param('id') id: string) {
    await this.dictService.remove(+id);
    return DataResult.ok();
  }

  @Get()
  async pageData(@Query() query: DictListSearchDto) {
    const result = await this.dictService.pageData(query);
    return DataResult.ok(result);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const res = await this.dictService.findById(+id);
    return DataResult.ok(res);
  }

  /** 通过编号查询已启用的字典信息 */
  @Get('type_no/:no')
  async findByTypeNo(@Param('no') no: string) {
    const res = await this.dictService.findByTypeNo(no);
    return DataResult.ok(res);
  }
}
