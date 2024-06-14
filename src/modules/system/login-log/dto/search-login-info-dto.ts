import { PagingDto } from 'src/utility/common';

export class SearchLoginLogDto extends PagingDto {
  /** 账号 */
  account?: string;
  /** 登录状态 */
  status?: number;
  /** 登录开始时间 */
  startTime?: string;
  /** 登录结束时间 */
  endTime?: string;
}
