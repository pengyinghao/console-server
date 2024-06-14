import { PagingDto } from 'src/utility/common';

export interface SearchOnlineDto extends PagingDto {
  /** 用户名 */
  name?: string;
  /** 账号 */
  account?: string;
  /** 登录地址 */
  loginAddr?: string;
}
