import { Get, Injectable, Logger } from '@nestjs/common';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { ApiException } from 'src/utility/common/api.exception';
import { ApiCode } from 'src/utility/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchListUploadDto } from './dto/search-list-upload.dto';
import { PagingResponse } from 'src/utility/common/api.paging.response';
import { getPaginationRange } from 'src/utility/common';
import { SysUpload } from './entities/upload';

@Injectable()
export class UploadService {
  @InjectRepository(SysUpload)
  uploadRepository: Repository<SysUpload>;

  private logger = new Logger();

  async create(update: SysUpload) {
    try {
      return this.uploadRepository.save(update);
    } catch (e) {
      this.logger.error(e, UploadService);
      throw new ApiException('操作失败', ApiCode.ERROR);
    }
  }

  async createMany(upload: SysUpload[]) {
    return this.uploadRepository.save(upload);
  }

  @Get()
  async list(query: SearchListUploadDto): Promise<PagingResponse> {
    const where: FindOptionsWhere<SysUpload> = {};
    if (query.originalname) {
      where.originalname = Like(`%${query.originalname}%`);
    }

    const [data, count] = await this.uploadRepository.findAndCount({
      ...getPaginationRange(query),
      where,
      order: {
        id: 'desc'
      }
    });

    return {
      total: count,
      data
    };
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
