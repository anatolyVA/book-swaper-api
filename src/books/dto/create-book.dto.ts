import { IsEnum, IsString, IsUUID } from 'class-validator';
import { BookCondition, CoverType, Genre } from '@prisma/client';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  language: string;

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
