import { Controller, Post, Param, Delete, UploadedFile, UseInterceptors, UploadedFiles, Query, Get } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/utility/pipe/file-size-validation.pipe';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import { DataResult } from 'src/utility/common/data.result';
import { SearchListUploadDto } from './dto/search-list-upload.dto';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { SysUpload } from './entities/upload';

@Controller('system/upload')
export class UploadController {
  filePath: string;
  folderPath: string;
  constructor(private readonly uploadService: UploadService, private readonly configServicer: ConfigService) {
    const filePath = path.join(this.configServicer.get('file.uploadDir', 'uploads'), dayjs().format('YYYYMMDD'));

    this.filePath = filePath;
    // 创建文件夹
    this.folderPath = path.join(process.cwd(), filePath);
  }

  private saveFile(file: Express.Multer.File) {
    const { buffer, originalname } = file;

    // 创建文件夹
    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true });
    }

    const ext = path.extname(originalname);
    const fileName = `${String(new Date().getTime()).split('').reverse().join('')}${ext}`;

    // 写入文件
    fs.writeFileSync(path.join(this.folderPath, fileName), buffer);

    return {
      ext,
      fileName,
      filePath: path.join(this.filePath, fileName)
    };
  }

  private createUpload(file: Express.Multer.File): SysUpload {
    const res = this.saveFile(file);
    const upload = new SysUpload();
    upload.ext = res.ext;
    upload.originalname = file.originalname;
    upload.fileName = res.fileName;
    upload.size = file.size;
    upload.url = res.filePath;
    return upload;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async upload(@UploadedFile(FileSizeValidationPipe) file: Express.Multer.File) {
    const upload = this.createUpload(file);
    if (!upload) return;
    try {
      const saveResult = await this.uploadService.create(upload);
      return DataResult.ok(saveResult.url, '操作成功');
    } catch {
      // 发生异常删除源文件
      fs.unlinkSync(path.join(this.folderPath, upload.fileName));
    }
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(@UploadedFiles(FileSizeValidationPipe) files: Express.Multer.File[]) {
    const uploads: SysUpload[] = files.map((file) => this.createUpload(file));
    try {
      const result = await this.uploadService.createMany(uploads);
      const urls = result.map((item) => item.url);
      return DataResult.ok(urls);
    } catch {
      // 发生异常删除源文件
      uploads.forEach((upload) => {
        fs.unlinkSync(path.join(this.folderPath, upload.fileName));
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }

  @Get()
  async list(@Query() query: SearchListUploadDto): Promise<DataResult<PagingResponse>> {
    const result = await this.uploadService.list(query);
    return DataResult.ok(result);
  }
}
