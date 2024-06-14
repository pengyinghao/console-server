import { IsNotEmpty } from 'class-validator';

export class PagingDto {
  @IsNotEmpty({ message: 'pageNo不能为空' })
  pageNo: number;
  @IsNotEmpty({ message: 'pagSize不能为空' })
  pageSize: number;
}
