import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysRoleMenu } from './entities/role-menu';
import { SysUser } from '../user/entities/user';
import { SysRole } from './entities/role';

@Module({
  imports: [TypeOrmModule.forFeature([SysRole, SysRoleMenu, SysUser])],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
