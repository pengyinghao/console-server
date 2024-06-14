import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SysMenu } from '../menu/entities/menu';
import { SysRole } from '../role/entities/role';
import { SysRoleMenu } from '../role/entities/role-menu';
import { SysUser } from './entities/user';
import { LoginLogService } from '../login-log/login-log.service';
import { SysLoginLog } from '../login-log/entities/login-log';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SysUser, SysMenu, SysRole, SysRoleMenu, SysLoginLog])],
  controllers: [UserController],
  providers: [UserService, LoginLogService]
})
export class UserModule {}
