import { ActionStatus } from '../enums/action.status.enum';

export class CreateLogDto {
  /** 模块名 */
  moduleName: string;
  /** 操作类型 */
  actionType: string;
  /** 操作人 */
  actionName: string;
  /** 操作人ip */
  actionIp?: string;
  /** 操作描述 */
  actionMessage: string;
  /** 操作人地址 */
  actionAddress?: string;
  /** 操作方法 */
  actionFunction: string;
  /** 创建时间 */
  createTime: Date;
  /** 请求方式 */
  requestMethod: string;
  /** 请求地址 */
  requestUrl: string;
  /**请求参数 */
  requestParams: string;
  /** 花费时间 */
  costTime: number;
  /** 浏览器 */
  browser: string;
  /** 操作系统 */
  os: string;
  /** 状态 */
  status: ActionStatus;
}
