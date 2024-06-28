import { PipeTransform, Injectable, HttpStatus } from '@nestjs/common';
import { ApiException } from '../common/api.exception';
import { ApiCode } from '../enums/api.code.enum';
import { RedisService } from 'src/modules/redis/redis.service';
import { RedisCache } from '../enums';
import { SysParams } from 'src/modules/system/param/entities/params';
@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private redisService: RedisService) {}

  fileSize(paramSize: number, size: number) {
    if (size > paramSize) {
      throw new ApiException('文件大小超出限制', ApiCode.BAD, HttpStatus.BAD_REQUEST);
    }
  }

  updateFileName(file: Express.Multer.File) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
  }

  async transform(value: Express.Multer.File | Express.Multer.File[]) {
    if (!value) throw new ApiException('未上传文件', ApiCode.BAD, HttpStatus.BAD_REQUEST);

    const params = await this.redisService.get<SysParams[]>(RedisCache.SYS_PARAMS);
    const uploadParams = params.find((item) => item.label === 'file.size');
    let uploadLimit = 1024 * 2; // 默认2m
    if (uploadParams) {
      uploadLimit = +uploadParams.value;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        this.fileSize(uploadLimit, item.size);
        this.updateFileName(item);
      });
      return value;
    } else {
      this.fileSize(uploadLimit, value.size);
      this.updateFileName(value);
    }
    return value;
  }
}
