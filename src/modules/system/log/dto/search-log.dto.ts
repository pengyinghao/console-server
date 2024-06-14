import { PagingDto } from 'src/utility/common';

export class SearchLogDto extends PagingDto {
  moduleName?: string;
  actionName?: string;
  actionType?: string;
  /** 开始日期 */
  startDate?: string;
  /** 结束日期 */
  endDate?: string;
}
