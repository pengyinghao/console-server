import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserFreezeDto {
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;

  @IsNotEmpty({ message: '冻结状态不能为空' })
  @IsNumber()
  freeze: number;
}
