import { SetMetadata } from '@nestjs/common';

export const ALLOW = 'allow';
/** 白名单，不需要验证token */
export const Allow = () => SetMetadata(ALLOW, true);
