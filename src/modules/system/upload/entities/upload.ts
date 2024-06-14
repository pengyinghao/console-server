import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sys_upload', comment: '文件上传记录' })
export class SysUpload {
  /** id */
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ comment: '文件大小' })
  size: number;

  @Column({ length: 100, comment: '原文件名' })
  originalname: string;

  @Column({ length: 100, comment: '文件名' })
  fileName: string;

  @Column({ comment: '文件地址' })
  url: string;

  @Column({ length: 20, comment: '拓展名', nullable: true })
  ext: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time', comment: '创建时间' })
  createTime: Date;
}
