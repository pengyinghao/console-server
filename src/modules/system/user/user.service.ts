import { UserLoginDto } from './dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Inject, Logger } from '@nestjs/common';
import { UserListSearchDto } from './dto/user-list-search.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode } from 'src/utility/enums';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { getPaginationRange } from 'src/utility/common';
import { Status } from 'src/utility/enums';
import { LoginStatus } from '../login-log/enums/login.status.enum';
import { HttpService } from 'src/modules/http/http.service';
import * as useragent from 'useragent';
import * as requestIp from 'request-ip';
import { SysUser } from './entities/user';
import { SysMenu } from '../menu/entities/menu';
import { SysRole } from '../role/entities/role';
import { SysRoleMenu } from '../role/entities/role-menu';
import { SysLoginLog } from '../login-log/entities/login-log';
import { LoginLogService } from '../login-log/login-log.service';
import { decrypt } from 'src/utility/common/crypto';
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,
    @InjectRepository(SysRole)
    private roleRepository: Repository<SysRole>,
    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly httpService: HttpService,
    private loginInfoService: LoginLogService
  ) {}

  /** 通过用户角色查询启用的菜单 */
  async getMenusForUser(): Promise<SysMenu[]> {
    const authorizedMenuInfos = await this.roleMenuRepository
      .createQueryBuilder('role_menu')
      .innerJoin('sys_role', 'role', 'role.id=role_menu.roleId')
      .leftJoin('sys_user', 'user', 'user.roleId=role.id')
      .where(`user.id=:id`, { id: this.request.user.id })
      .getMany();

    const menuIds = authorizedMenuInfos.map((menu) => menu.menuId);

    if (menuIds.length === 0) {
      return [];
    }

    const query = `
    WITH RECURSIVE menu_tree AS (
      SELECT 
        id, 
        sort, 
        component, 
        display, 
        icon,
        status,
        open_type AS openType, 
        parent_id AS parentId, 
        url, 
        params, 
        name, 
        type, 
        code,
        delete_time
      FROM sys_menu
      WHERE id IN (${menuIds.join(',')})
      UNION
      SELECT 
        m.id, 
        m.sort, 
        m.component, 
        m.display, 
        m.icon, 
        m.status,
        m.open_type AS openType, 
        m.parent_id AS parentId, 
        m.url, 
        m.params, 
        m.name, 
        m.type, 
        m.code,
        m.delete_time
      FROM sys_menu m
      INNER JOIN menu_tree mt ON mt.parentId = m.id
    )
    SELECT * FROM menu_tree
         where status=1
         and delete_time is null
     ORDER BY sort ASC;
  `;

    const res = await this.roleMenuRepository.query(query);
    return res;
  }

  /** 获取用户角色 */
  async getUserRole() {
    return this.roleRepository.findOneBy({
      id: this.request.user.roleId
    });
  }

  /** 用户登录 */
  async login(loginUser: UserLoginDto) {
    const user = await this.userRepository.findOneBy({
      account: loginUser.account
    });
    if (!user) {
      this.loginLog(LoginStatus.FAIL, '用户不存在');
      throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);
    }
    if (user.freeze) {
      this.loginLog(LoginStatus.FAIL, '用户被冻结');
      throw new ApiException('用户被冻结', ApiCode.DATA_INVALID);
    }
    if (decrypt(user.password) !== decrypt(loginUser.password)) {
      this.loginLog(LoginStatus.FAIL, '密码错误');
      throw new ApiException('密码错误', ApiCode.DATA_INVALID);
    }
    this.loginLog(LoginStatus.SUCCESS, '登录成功');
    return user;
  }

  async loginLog(code: LoginStatus, msg: string) {
    const userAgent = useragent.parse(this.request.headers['user-agent']);
    const clientIp = requestIp.getClientIp(this.request) || this.request.ip;
    const { addr, ip } = await this.httpService.ipToCity(clientIp);
    const loginLog = new SysLoginLog();
    loginLog.account = this.request.body.account;
    loginLog.loginIp = ip;
    loginLog.loginAddr = addr;
    loginLog.browser = userAgent.toAgent();
    loginLog.os = userAgent.os.toString();
    loginLog.loginTime = new Date();
    loginLog.status = code;
    loginLog.message = msg;
    this.loginInfoService.create(loginLog);
    // this.eventEmitter.emit(Listeners.LOGIN_INFO_CREATE, loginLog);
    this.logger.debug(JSON.stringify(loginLog));
  }

  /** 通过用户id查询用户 */
  async findUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'phone', 'email', 'address', 'sysUser', 'roleId', 'roleName']
    });
    if (!user) throw new ApiException('用户不存在', ApiCode.DATA_ID_INVALID);
    if (user.freeze) throw new ApiException('用户被冻结', ApiCode.DATA_INVALID);
    return user;
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
  detail() {
    return this.userRepository.findOne({
      where: {
        id: this.request.user.id
      },
      select: ['id', 'account', 'email', 'name', 'phone', 'avatar', 'roleId', 'roleName']
    });
  }

  /** 修改 用户头像 */
  async updateUserAvatar(url: string) {
    const res = await this.userRepository.update(this.request.user.id, {
      avatar: url
    });
    if (res.affected === 0) {
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
    return res;
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
