import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, FindOptionsWhere, Like, In, EntityManager } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode } from 'src/utility/enums';
import { SearchRoleDto } from './dto/search-role.dto';
import { RoleMenuAuthorizeDto } from './dto/role-menu-authorize.dto';
import { getPaginationRange } from 'src/utility/common';
import { RoleUserDto } from './dto/role-user.dto';
import { RoleEnum } from './enums/role.enum';
import { SysRole } from './entities/role';
import { SysRoleMenu } from './entities/role-menu';
import { SysUser } from '../user/entities/user';

@Injectable()
export class RoleService {
  @InjectRepository(SysRole)
  private readonly roleRepository: Repository<SysRole>;

  @InjectRepository(SysRoleMenu)
  private readonly roleMenuRepository: Repository<SysRoleMenu>;

  @InjectRepository(SysUser)
  private readonly userRepository: Repository<SysUser>;

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  /** 授权 */
  async authorize(roleMenuAuthorizeDto: RoleMenuAuthorizeDto) {
    const { roleId, menuIds, defaultNavigate } = roleMenuAuthorizeDto;

    // 查询当前角色所有菜单
    const currentRoleMenus = await this.roleMenuRepository.find({
      where: { roleId: roleMenuAuthorizeDto.roleId }
    });

    const currentMenuIds = currentRoleMenus.map((item) => item.menuId);

    // 找出需要删除的菜单id
    const menuIdsToDelete = currentMenuIds.filter((menuId) => !menuIds.includes(menuId));

    // 找出需要添加的菜单id
    const menuIdsToAdd = menuIds.filter((menuId) => !currentMenuIds.includes(menuId));

    await this.entityManager.transaction(async () => {
      await this.roleRepository.update(roleId, {
        defaultNavigate
      });
      // 批量删除需要删除的关联
      if (menuIdsToDelete.length > 0) {
        await this.roleMenuRepository.delete({
          roleId,
          menuId: In(menuIdsToDelete)
        });
      }

      // 批量插入需要添加的关联
      if (menuIdsToAdd.length > 0) {
        const newRoleMenus = menuIdsToAdd.map((menuId) => {
          const roleMenu = new SysRoleMenu();
          roleMenu.roleId = roleId;
          roleMenu.menuId = menuId;
          return roleMenu;
        });
        await this.roleMenuRepository.save(newRoleMenus);
      }
    });
  }

  /** 通过角色id获取授权的菜单集合 */
  async getAuthorizeMenuIds(roleId: number) {
    return this.roleMenuRepository.find({ where: { roleId } });
  }

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.findOneBy({
      name: createRoleDto.name
    });
    if (role) throw new ApiException('角色名称已存在', ApiCode.DATA_INVALID);

    return await this.roleRepository.save(createRoleDto);
  }

  async list(query: SearchRoleDto) {
    const where: FindOptionsWhere<SysRole> = {};
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    return await this.roleRepository.find({ where });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      select: ['id', 'name', 'remark']
    });
    if (!role) throw new ApiException('角色未找到', ApiCode.DATA_NOT_FOUND);
    return role;
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const res = await this.findOne(updateRoleDto.id);
    if (!res) throw new ApiException('数据不存在', ApiCode.DATA_NOT_FOUND);
    if (res.type === RoleEnum.system) throw new ApiException('内置角色不能修改', ApiCode.ERROR);

    const role = await this.roleRepository.findOne({
      where: {
        name: updateRoleDto.name,
        id: Not(updateRoleDto.id)
      }
    });
    if (role) throw new ApiException('角色名称已存在', ApiCode.ERROR);

    const updateResult = await this.roleRepository.update(updateRoleDto.id, updateRoleDto);
    if (updateResult.affected === 0) {
      throw new ApiException('更新失败', ApiCode.DATA_NOT_FOUND);
    }
    return updateResult;
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (role.type === RoleEnum.system) throw new ApiException('内置角色不能删除', ApiCode.ERROR);

    await this.entityManager.transaction(async () => {
      await this.roleRepository.delete(id);
      await this.roleMenuRepository.delete({ roleId: id });
    });
    return true;
  }

  async roleUser(query: RoleUserDto) {
    const paging = getPaginationRange(query);
    const repository = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('sys_role', 'role', 'user.roleId = role.id')
      .where('user.roleId = :id', { id: query.roleId });

    const data = await repository.skip(paging.skip).take(paging.take).getMany();
    const total = await repository.getCount();

    return {
      data,
      total
    };
  }
}
