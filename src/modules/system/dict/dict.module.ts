import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDictType } from '../dict-type/entities/dict-type';
import { SysDict } from './entities/dict';

@Module({
  imports: [TypeOrmModule.forFeature([SysDict, SysDictType])],
  controllers: [DictController],
  providers: [DictService],
  exports: [DictService]
})
export class DictModule {}
