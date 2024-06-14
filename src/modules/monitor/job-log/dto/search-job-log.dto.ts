import { PagingDto } from 'src/utility/common';

export class SearchJobLogDto extends PagingDto {
  status?: number;
  /** 任务名称 */
  jobName?: string;
}
