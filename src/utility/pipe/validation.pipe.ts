import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiException } from '../common';
import { ApiCode } from '../enums';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToInstance(metadata.metatype, value);
    if (!object) return value;
    if (typeof object === 'string') return value;

    const errors = await validate(object);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints)[0];
      throw new ApiException(errorMessage, ApiCode.BAD, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
