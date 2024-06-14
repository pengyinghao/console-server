import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUpload } from './entities/upload';

@Module({
  imports: [TypeOrmModule.forFeature([SysUpload])],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
