import { plainToInstance } from 'class-transformer';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class QueryTransformPipe implements PipeTransform {
  async transform(value: QueryDto, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    return plainToInstance(metatype, value);
  }
}
