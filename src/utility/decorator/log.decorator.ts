import { SetMetadata } from '@nestjs/common';
/** 操作模块 */
export const LOG_RECORD_CONTROLLER = 'LOG_RECORD_CONTROLLER';

/** 操作方法 */
export const LOG_RECORD_ACTION = 'LOG_RECORD_ACTION';

/** 类装饰器 */
export const LogRecordController = (name: string): ClassDecorator => SetMetadata(LOG_RECORD_CONTROLLER, name);

type Action = 'create' | 'update' | 'delete' | 'other';

/** 方法装饰器 */
export const LogRecordAction = (message: string, action: Action = 'create'): MethodDecorator => {
  return SetMetadata(LOG_RECORD_ACTION, [message, action]);
};
