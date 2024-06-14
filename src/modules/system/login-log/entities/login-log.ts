import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sys_login_log', comment: '登录日志' })
export class SysLoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名' })
  account: string;

  @Column({ comment: '登录ip', name: 'login_ip' })
  loginIp: string;

  @Column({ comment: '登录地址', name: 'login_addr' })
  loginAddr: string;

  @Column({ comment: '登录时间', type: 'timestamp', name: 'login_time' })
  loginTime: Date;

  @Column({ comment: '浏览器' })
  browser: string;

  @Column({ comment: '操作系统' })
  os: string;

  @Column({
    type: 'tinyint',
    comment: '登录状态(0:成功，1：失败)'
  })
  status: number;

  @Column({ comment: '消息' })
  message: string;
}
