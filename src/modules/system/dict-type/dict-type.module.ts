import { Module } from '@nestjs/common';
import { DictTypeService } from './dict-type.service';
import { DictTypeController } from './dict-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDictType } from './entities/dict-type';
import { SysDict } from '../dict/entities/dict';

@Module({
  imports: [TypeOrmModule.forFeature([SysDict, SysDictType])],
  controllers: [DictTypeController],
  providers: [DictTypeService],
  exports: [DictTypeService]
})
export class DictTypeModule {}
