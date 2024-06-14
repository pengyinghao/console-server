import { PartialType } from '@nestjs/mapped-types';
import { CreateJobLogDto } from './create-job-log.dto';

export class UpdateJobLogDto extends PartialType(CreateJobLogDto) {}
