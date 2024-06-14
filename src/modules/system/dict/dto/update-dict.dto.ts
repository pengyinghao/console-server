import { IsNotEmpty } from 'class-validator';
import { CreateDictDto } from './create-dict.dto';

export class UpdateDictDto extends CreateDictDto {
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;
}
