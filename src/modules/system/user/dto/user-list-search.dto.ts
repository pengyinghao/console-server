import { PagingDto } from 'src/utility/common';

export class UserListSearchDto extends PagingDto {
  name?: string;
  account?: string;
}
