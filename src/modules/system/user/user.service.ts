import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListSearchDto } from './dto/user-list-search.dto';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode } from 'src/utility/enums';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { getPaginationRange } from 'src/utility/common';
import { Status } from 'src/utility/enums';
import { SysUser } from './entities/user';
import { decrypt } from 'src/utility/common/crypto';
import { LoginStatus } from '../login-log/enums/login.status.enum';
import { LoginLogService } from '../login-log/login-log.service';
import { RoleUserDto } from './dto/role-user.dto';
import { Request } from 'express';

export class UserService {
  constructor(
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,
    private loginInfoService: LoginLogService
  ) {}

  /** 用户登录 */
  async login({ account, password, request }: { account: string; password: string; request: Request }) {
    const user = await this.userRepository.findOneBy({
      account: account
    });
    if (!user) {
      await this.loginLog({ code: LoginStatus.FAIL, msg: '用户不存在', request });
      throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);
    }
    if (user.freeze) {
      await this.loginLog({ code: LoginStatus.FAIL, msg: '用户被冻结', request });
      throw new ApiException('用户被冻结', ApiCode.DATA_INVALID);
    }
    if (decrypt(user.password) !== decrypt(password)) {
      await this.loginLog({ code: LoginStatus.FAIL, msg: '密码错误', request });
      throw new ApiException('密码错误', ApiCode.DATA_INVALID);
    }
    await this.loginLog({ code: LoginStatus.SUCCESS, msg: '登录成功', request });
    return user;
  }

  /** 角色用户信息 */
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

  private async loginLog(params: { code: LoginStatus; msg: string; request: Request }) {
    this.loginInfoService.create(params);
  }

  /** 通过用户id查询用户 */
  async findUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'phone', 'email', 'account', 'address', 'sysUser', 'roleId', 'roleName']
    });
    if (!user) throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);
    if (user.freeze) throw new ApiException('用户被冻结', ApiCode.DATA_INVALID);
    return user;
  }

  async findUserDetail(id: number) {
    return this.userRepository.findOneBy({ id: id });
  }

  /** 创建用户 */
  async create(userDto: CreateUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      account: userDto.account
    });
    if (foundUser) throw new ApiException('账号已存在', ApiCode.DATA_INVALID);
    let user = new SysUser();
    user = { ...user, ...userDto };
    user.freeze = 0;
    user.sysUser = 1;

    return this.userRepository.save(user);
  }

  /** 修改用户 */
  async update(userDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id: userDto.id
    });
    if (!user) throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);

    return this.userRepository.update(userDto.id, { ...userDto });
  }

  /** 修改用户状态 */
  async updateStatus(userId: number, status: Status) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);

    const res = await this.userRepository.update(userId, {
      status: status
    });
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    return res;
  }

  /** 冻结/取消冻结 用户 */
  async freeUser(userId: number, isFreeze: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);

    const res = await this.userRepository.update(userId, {
      freeze: isFreeze
    });
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    return res;
  }

  /** 删除用户 */
  async delete(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    });
    if (!user) throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);
    if (user.status === Status.enable) throw new ApiException('已启用的数据不允许删除', ApiCode.DATA_INVALID);
    if (user.sysUser) throw new ApiException('该用户为系统用户，无法删除', ApiCode.DATA_INVALID);

    const res = await this.userRepository.softDelete({ id: userId });
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    return res;
  }

  /** 获取当前用户详情 */
  detail(userId: number) {
    return this.userRepository.findOne({
      where: {
        id: userId
      },
      select: ['id', 'account', 'email', 'name', 'phone', 'avatar', 'roleId', 'roleName']
    });
  }

  /** 修改 用户头像 */
  async updateUserAvatar(userId: number, url: string) {
    const res = await this.userRepository.update(userId, {
      avatar: url
    });
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    return res;
  }

  /** 更新密码 */
  async updatePassword(id: number, newPassword: string) {
    this.userRepository.update(id, { password: newPassword });
  }

  /** 分页查询用户 */
  async pageUser(query: UserListSearchDto): Promise<PagingResponse> {
    const where: FindOptionsWhere<SysUser> = {};
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.account) {
      where.account = Like(`%${query.account}%`);
    }

    const [user, count] = await this.userRepository.findAndCount({
      ...getPaginationRange(query),
      where,
      order: {
        id: 'desc'
      }
    });

    return {
      total: count,
      data: user
    };
  }
}
