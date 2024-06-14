import { PagingDto } from 'src/utility/common';

export class SearchJobDto extends PagingDto {
  /** 任务名称 */
  name?: string;
  /** 任务类型 */
  type?: number;
  /** 任务状态 */
  status?: number;
}
