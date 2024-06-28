import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUser } from './entities/user';
import { RoleService } from '../role/role.service';
import { SysLoginLog } from '../login-log/entities/login-log';
import { LoginLogService } from '../login-log/login-log.service';
import { SysRole } from '../role/entities/role';
import { SysRoleMenu } from '../role/entities/role-menu';

@Module({
  imports: [TypeOrmModule.forFeature([SysUser, SysRole, SysRoleMenu, SysLoginLog])],
  controllers: [UserController],
  providers: [UserService, RoleService, LoginLogService],
  exports: [UserService]
})
export class UserModule {}
