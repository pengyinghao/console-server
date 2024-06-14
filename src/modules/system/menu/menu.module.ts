import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysRoleMenu } from '../role/entities/role-menu';
import { SysMenu } from './entities/menu';

@Module({
  imports: [TypeOrmModule.forFeature([SysMenu, SysRoleMenu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService]
})
export class MenuModule {}
