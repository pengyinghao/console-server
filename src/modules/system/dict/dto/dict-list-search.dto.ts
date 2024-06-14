import { PagingDto } from 'src/utility/common/dto/paging.dto';

export class DictListSearchDto extends PagingDto {
  /** 类型id */
  typeId?: number;
  /** 字典名称 */
  name?: string;
}
