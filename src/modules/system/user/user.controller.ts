import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Allow } from 'src/utility/decorator';
import { UserListSearchDto } from './dto/user-list-search.dto';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode, RedisCache } from 'src/utility/enums';
import { DataResult } from 'src/utility/common/data.result';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { UpdateUserFreezeDto } from './dto/update-user-freeze.dto';
import { UpdateStateDto } from 'src/utility/common/dto/update-status.dto';
import { LogRecordController, LogRecordAction } from 'src/utility/decorator';
import { RedisService } from 'src/modules/redis/redis.service';
import { generateUUID } from 'src/utility/common';
import ms = require('ms');
import { Request } from 'express';
import { HttpService } from 'src/modules/http/http.service';
import * as useragent from 'useragent';
import { OnlineUser } from 'src/modules/monitor/online/entities/online-user';
import { SysUser } from './entities/user';
import { UpdatePasswordDto } from './dto/update-user-password.dto';
import { decrypt } from 'src/utility/common/crypto';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from '../role/role.service';
import { RoleUserDto } from './dto/role-user.dto';

@Controller('system/user')
@LogRecordController('用户管理')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService
  ) {}

  /** 获取角色下的用户 */
  @Get('role_user')
  async roleUser(@Query() query: RoleUserDto) {
    const res = await this.userService.roleUser(query);
    return DataResult.ok(res);
  }

  /** 登录 */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @Allow()
  async login(@Body() loginUser: UserLoginDto, @Req() req: Request) {
    const user = req.user;
    this.redisService.delete(loginUser.uuid);
    if (user) {
      const uuid = generateUUID();
      this.handleOnline(user as unknown as SysUser, req, uuid);
      return this.handleToken(user as unknown as SysUser, uuid);
    }
  }

  /** 刷新token */
  @Get('refresh')
  @Allow()
  async refresh(@Query('refresh_token') refreshToken: string, @Req() req: Request) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      const uuid = generateUUID();
      await this.handleOnline(user, req, uuid);
      return this.handleToken(user, uuid);
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  /** 获取当前用户信息、菜单、权限等 */
  @Get('current')
  async current(@Req() req: Request) {
    const user = await this.userService.detail(req.user.id);
    const userRole = await this.roleService.findOne(req.user.id);
    const menu = await this.roleService.getMenusForUser(req.user.id);

    user.phone = user.phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2');

    if (user.email)
      user.email = user.email.replace(/^([a-zA-Z0-9._%+-]{2})[a-zA-Z0-9._%+-]*([a-zA-Z0-9._%+-]{2})@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, '$1****$2@$3');

    return DataResult.ok({
      user: { ...user, uuid: req.user?.uuid },
      menu: menu.filter((item) => item.type !== 2),
      btn: menu
        .filter((item) => item.type === 2)
        .map((item) => {
          return {
            id: item.id,
            code: item.code,
            icon: item.icon,
            menuId: item.parentId
          };
        }),
      redirect: userRole.defaultNavigate
    });
  }

  /** 处理在线用户 */
  private async handleOnline(user: SysUser, req: Request, uuid: string) {
    const { addr, ip } = await this.httpService.ipToCity(req.ip);
    const userAgent = useragent.parse(req.headers['user-agent']);
    const redisData: OnlineUser = {
      uuid,
      account: user.account,
      name: user.name,
      role: user.roleName,
      loginAddr: addr,
      loginIp: ip,
      loginTime: new Date(),
      os: userAgent.os.toString(),
      browser: userAgent.toAgent()
    };

    const expire = this.configService.get<string>('jwt.expiresIn');
    await this.redisService.set(`${RedisCache.USER_LOGIN}${uuid}`, redisData, ms(expire));
  }

  /** 处理token */
  private async handleToken(user: SysUser, uuid: string) {
    const accessTokenObj: Express.Request['user'] = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      roleId: user.roleId,
      roleName: user.roleName,
      uuid
    };

    const expire = this.configService.get<string>('jwt.expiresIn');
    const access_token = this.jwtService.sign(
      {
        user: accessTokenObj
      },
      {
        expiresIn: expire
      }
    );

    const refresh_token = this.jwtService.sign(
      {
        userId: user.id
      },
      {
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn')
      }
    );

    return DataResult.ok({
      access_token,
      refresh_token
    });
  }

  /** 退出登录 */
  @Post('login_out')
  async loginOut(@Req() req: Request) {
    const uuid = req.user.uuid;
    // 删除当前在线用户
    this.redisService.delete(`${RedisCache.USER_LOGIN}${uuid}`);
    return DataResult.ok();
  }

  /** 创建用户 */
  @Post()
  @LogRecordAction('创建用户', 'create')
  async create(@Body() userDto: CreateUserDto) {
    await this.userService.create(userDto);
    return DataResult.ok();
  }

  /** 修改用户 */
  @Put()
  @LogRecordAction('修改用户', 'update')
  async update(@Body() userDto: UpdateUserDto) {
    await this.userService.update(userDto);
    return DataResult.ok();
  }

  /** 查询用户详情 */
  @Get(':id')
  async getUser(@Param('id') id: number) {
    const res = await this.userService.findUserById(id);
    return DataResult.ok(res);
  }

  /** 删除用户 */
  @Delete(':id')
  @LogRecordAction('删除用户', 'delete')
  async remove(@Param('id') id: number) {
    await this.userService.delete(id);
    return DataResult.ok();
  }

  /** 修改用户状态 */
  @Put('status')
  @LogRecordAction('修改用户状态', 'update')
  async updateStatus(@Body() { id, status }: UpdateStateDto) {
    await this.userService.updateStatus(id, status);
    return DataResult.ok();
  }

  /** 冻结/取消冻结 用户 */
  @Put('freeze')
  @LogRecordAction('冻结用户', 'update')
  async updateUserFreeze(@Body() updateUserFreezeDto: UpdateUserFreezeDto) {
    await this.userService.freeUser(updateUserFreezeDto.id, updateUserFreezeDto.freeze);
    return DataResult.ok();
  }

  @Get()
  async pageUser(@Query() query: UserListSearchDto): Promise<DataResult<PagingResponse>> {
    const result = await this.userService.pageUser(query);
    return DataResult.ok(result);
  }

  @Put('avatar')
  async updateUserAvatar(@Req() req: Request, @Query('url') url: string) {
    await this.userService.updateUserAvatar(req.user.id, url);
    return DataResult.ok();
  }

  @Post('update_password')
  @LogRecordAction('修改密码', 'update')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req: Request) {
    const user = await this.userService.findUserDetail(req.user.id);

    if (decrypt(updatePasswordDto.newPassword) === decrypt(updatePasswordDto.oldPassword)) {
      throw new ApiException('新密码不能与旧密码相同', ApiCode.DATA_INVALID);
    }

    if (decrypt(user.password) !== decrypt(updatePasswordDto.oldPassword)) throw new ApiException('原密码错误', ApiCode.DATA_INVALID);
    await this.userService.updatePassword(user.id, updatePasswordDto.newPassword);

    this.redisService.delete(`${RedisCache.USER_LOGIN}${req.user.uuid}`);
    return DataResult.ok();
  }
}
