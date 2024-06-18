import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}
