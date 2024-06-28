import { Global, Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDict } from './entities/dict';
import { DictTypeService } from '../dict-type/dict-type.service';
import { SysDictType } from '../dict-type/entities/dict-type';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SysDict, SysDictType])],
  controllers: [DictController],
  providers: [DictService, DictTypeService],
  exports: [DictService]
})
export class DictModule {}
