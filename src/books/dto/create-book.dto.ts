import {
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BookCondition, CoverType, Genre } from '@prisma/client';

export class CreateBookDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  languageCode: string;

  @IsEnum(Genre)
  genre: Genre;

  @IsEnum(CoverType)
  coverType: CoverType;

  @IsEnum(BookCondition)
  condition: BookCondition;

  @IsString()
  @IsUUID()
  authorId: string;
}
