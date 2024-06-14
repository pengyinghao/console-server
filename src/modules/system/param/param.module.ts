import { Module } from '@nestjs/common';
import { ParamService } from './param.service';
import { ParamController } from './param.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysParams } from './entities/params';

@Module({
  imports: [TypeOrmModule.forFeature([SysParams])],
  controllers: [ParamController],
  providers: [ParamService],
  exports: [ParamService]
})
export class ParamModule {}
