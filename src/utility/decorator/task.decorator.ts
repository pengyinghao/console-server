import { SetMetadata } from '@nestjs/common';

// 标记定时任务， 动态执行方法
export const TASK = 'task';
export const Task = () => SetMetadata(TASK, true);
