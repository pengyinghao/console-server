import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { EntityManager, FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode } from 'src/utility/enums';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { dataToTree } from 'src/utility/common';
import { SearchMenuDto } from './dto/search-menu.dt';
import { Status } from 'src/utility/enums';
import { SysMenu } from './entities/menu';
import { SysRoleMenu } from '../role/entities/role-menu';

@Injectable()
export class MenuService {
  @InjectRepository(SysMenu)
  private readonly menuRepository: Repository<SysMenu>;

  @InjectRepository(SysRoleMenu)
  private readonly roleMenuRepository: Repository<SysRoleMenu>;

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  /** 创建菜单 */
  async create(createMenuDto: CreateMenuDto) {
    const res = await this.menuRepository.findOneBy({
      name: createMenuDto.name
    });
    if (res) {
      throw new ApiException('菜单名称不能重复', ApiCode.DATA_INVALID);
    }

    if (!createMenuDto.parentId) createMenuDto.parentId = null;

    await this.entityManager.transaction(async () => {
      const menu = await this.menuRepository.save(createMenuDto);
      await this.roleMenuRepository.save({
        roleId: this.request.user.roleId,
        menuId: menu.id
      });
    });
  }

  /** 查询所有菜单 */
  findAll() {
    return this.menuRepository.find();
  }

  /** 查询启用的菜单 */
  findEnableMenu() {
    return this.menuRepository.find({
      where: { status: Status.enable },
      select: ['id', 'sort', 'component', 'display', 'icon', 'openType', 'parentId', 'url', 'params', 'name', 'type', 'code'],
      order: {
        sort: 'asc'
      }
    });
  }

  /** 获取菜单详情 */
  async findOne(id: number) {
    const res = await this.menuRepository.findOneBy({ id });
    if (!res) {
      throw new ApiException('菜单不存在', ApiCode.DATA_ID_INVALID);
    }
    return res;
  }

  /** 更新菜单 */
  async update(updateMenuDto: UpdateMenuDto) {
    const res = await this.findOne(updateMenuDto.id);
    if (!res) {
      throw new ApiException('菜单不存在', ApiCode.DATA_ID_INVALID);
    }
    return this.menuRepository.update(updateMenuDto.id, updateMenuDto);
  }

  /** 删除菜单 */
  async remove(id: number) {
    const res = await this.findOne(id);
    if (!res) {
      throw new ApiException('菜单不存在', ApiCode.DATA_ID_INVALID);
    }
    if (res.status === Status.enable) {
      throw new ApiException('已启用的菜单不允许删除', ApiCode.DATA_INVALID);
    }
    return this.menuRepository.softDelete({ id });
  }

  /** 获取树形菜单 */
  async treeMenu() {
    const menus = await this.menuRepository.find({
      select: ['name', 'id', 'parentId'],
      order: {
        sort: 'asc'
      }
    });
    return dataToTree(menus, 'parentId');
  }

  /** 查询菜单列表 */
  async page(query: SearchMenuDto) {
    const where: FindOptionsWhere<SysMenu> = {};
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }

    const menus = await this.menuRepository.find({
      where,
      order: { sort: 'asc' }
    });

    return dataToTree(menus, 'parentId');
  }
}
