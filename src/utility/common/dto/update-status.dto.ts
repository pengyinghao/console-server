import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../../enums/status.enum';

export class UpdateStateDto {
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;

  @IsNotEmpty({ message: '状态不能为空' })
  @IsEnum(Status, { message: '状态不正确' })
  status: Status;
}
