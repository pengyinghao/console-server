import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sys_log', comment: '操作日志' })
export class SysLog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
  /** 模块名 */
  @Column({ comment: '模块名', length: 20 })
  moduleName: string;

  /** 操作描述 */
  @Column({ comment: '操作描述', length: 50, name: 'action_message' })
  actionMessage: string;

  /** 操作类型 */
  @Column({ comment: '操作类型', length: 10, name: 'action_type' })
  actionType: string;

  /** 操作人 */
  @Column({ comment: '操作人', length: 20, name: 'action_name' })
  actionName: string;

  /** 操作人ip */
  @Column({ comment: '操作人ip', length: 20, name: 'action_ip' })
  actionIp: string;

  /** 操作人地址 */
  @Column({ comment: '操作人地址', length: 50, name: 'action_address' })
  actionAddress: string;

  /** 操作方法 */
  @Column({ comment: '操作方法', length: 100, name: 'action_function' })
  actionFunction: string;

  @Column({ comment: '浏览器', length: 20 })
  browser: string;

  @Column({ comment: '操作系统', length: 20 })
  os: string;

  /** 创建时间 */
  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;

  /** 请求方式 */
  @Column({ comment: '请求方式', length: 20, name: 'request_method' })
  requestMethod: string;

  /** 请求地址 */
  @Column({ comment: '请求地址', length: 100, name: 'request_url' })
  requestUrl: string;

  /**请求参数 */
  @Column({ comment: '请求参数', type: 'text' })
  requestParams: string;

  /** 花费时间 */
  @Column({ comment: '花费时间' })
  costTime: number;
}
