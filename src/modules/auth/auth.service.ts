import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../system/user/user.service';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  /** 用户用户 */
  async validateUser(request: Request, account: string, password: string) {
    const user = await this.userService.login({ account, password, request });
    return user;
  }
}
