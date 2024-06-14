import { IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';
import { ruleHelper } from 'src/utility/common';

export class CreateJobDto {
  /** 任务名称 */
  @Matches(ruleHelper.unable_contain_special.reg, {
    message: `任务名称${ruleHelper.unable_contain_special.message}`
  })
  @MaxLength(20, { message: '任务名称最大长度为20' })
  @IsNotEmpty({ message: '任务名称不能为空' })
  name: string;

  /** 定时表达式 */
  @MaxLength(50, { message: '定时表达式最大长度为50' })
  @Matches(ruleHelper.cron.reg, {
    message: `定时${ruleHelper.cron.message}`
  })
  @IsNotEmpty({ message: '定时表达式不能为空' })
  cron: string;

  @MaxLength(100, { message: '任务执行服务最大长度为100' })
  @IsNotEmpty({ message: '任务执行服务不能为空' })
  service: string;

  /** 任务执行参数 */
  @IsOptional()
  @MaxLength(200, { message: '任务执行参数最大长度为200' })
  params: string;

  startTime: Date;
  endTime: Date;

  @IsNotEmpty({ message: '是否立即执行不能为空' })
  immediate: number;

  /** 任务描述 */
  @IsOptional()
  @MaxLength(200, { message: 'remark最大长度为200' })
  remark: string;
}
