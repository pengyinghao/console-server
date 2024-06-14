import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Allow } from 'src/utility/decorator';
import { UserListSearchDto } from './dto/user-list-search.dto';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode, Cache } from 'src/utility/enums';
import { DataResult } from 'src/utility/common/data.result';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { UpdateUserFreezeDto } from './dto/update-user-freeze.dto';
import { UpdateStateDto } from 'src/utility/common/dto/update-status.dto';
import { LogRecordController, LogRecordAction } from 'src/utility/decorator';
import { RedisService } from 'src/modules/redis/redis.service';
import { LoginStatus } from '../login-log/enums/login.status.enum';
import { generateUUID } from 'src/utility/common';
import * as ms from 'ms';
import { Request } from 'express';
import { HttpService } from 'src/modules/http/http.service';
import * as useragent from 'useragent';
import { OnlineUser } from 'src/modules/monitor/online/entities/online-user';
import { SysUser } from './entities/user';

@Controller('system/user')
@LogRecordController('用户管理')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService
  ) {}

  /** 登录 */
  @Post('login')
  @Allow()
  async login(@Body() loginUser: UserLoginDto, @Req() req: Request) {
    const { uuid, code } = loginUser;
    const redisKey = `${Cache.CAPTCHA_CODE}${uuid}`;
    const redisCode = await this.redisService.get(redisKey);

    if (redisCode === null) {
      this.userService.loginLog(LoginStatus.FAIL, '验证码已过期');
      throw new ApiException('验证码过期', ApiCode.CODE_EXPIRED, HttpStatus.OK);
    }
    if (redisCode.toLowerCase() !== code.toLowerCase()) {
      this.userService.loginLog(LoginStatus.FAIL, '验证码错误');
      this.redisService.delete(loginUser.uuid);
      throw new ApiException('验证码错误', ApiCode.CODE_INVALID, HttpStatus.OK);
    }
    const user = await this.userService.login(loginUser);
    this.redisService.delete(loginUser.uuid);
    if (user) {
      this.handleOnline(user, req);
      return this.handleToken(user);
    }
  }

  /** 刷新token */
  @Get('refresh')
  @Allow()
  async refresh(@Query('refresh_token') refreshToken: string, @Req() req: Request) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      this.handleOnline(user, req);
      return this.handleToken(user);
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  /** 获取当前用户信息、菜单、权限等 */
  @Get('current')
  async current() {
    const user = await this.userService.detail();
    const userRole = await this.userService.getUserRole();
    const menu = await this.userService.getMenusForUser();

    user.phone = user.phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
    user.email = user.email.replace(/^([a-zA-Z0-9._%+-]{2})[a-zA-Z0-9._%+-]*([a-zA-Z0-9._%+-]{2})@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, '$1****$2@$3');

    return DataResult.ok({
      user,
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
  private async handleOnline(user: SysUser, req: Request) {
    const { addr, ip } = await this.httpService.ipToCity(req.ip);
    const userAgent = useragent.parse(req.headers['user-agent']);
    const uuid = generateUUID();
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
    this.redisService.set(`${Cache.USER_LOGIN}${uuid}`, redisData, ms(expire));
  }

  /** 处理token */
  private async handleToken(user: SysUser) {
    const accessTokenObj: Express.Request['user'] = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      roleId: user.roleId,
      roleName: user.roleName
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
  async updateUserAvatar(@Query('url') url: string) {
    await this.userService.updateUserAvatar(url);
    return DataResult.ok();
  }
}
