import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginLogController } from './login-log.controller';
import { LoginLogService } from './login-log.service';
import { SysLoginLog } from './entities/login-log';
@Module({
  imports: [TypeOrmModule.forFeature([SysLoginLog])],
  controllers: [LoginLogController],
  providers: [LoginLogService]
})
export class LoginLogModule {}
