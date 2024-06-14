import { SetMetadata } from '@nestjs/common';

export const NO_TRANSFORM = 'no-transform';
// 数据不需要处理
export const noTransform = () => SetMetadata(NO_TRANSFORM, true);
