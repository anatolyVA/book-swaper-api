import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { BookCondition, BookStatus, CoverType, Genre } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  public readonly offset?: number;

  @IsOptional()
  @IsString()
  public readonly search?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(BookCondition, { each: true })
  @Transform(({ value }) => transformToArray(value))
  public readonly condition?: BookCondition[];

  @IsOptional()
  @IsArray()
  @IsEnum(CoverType, { each: true })
  @Transform(({ value }) => transformToArray(value))
  public readonly coverType?: CoverType[];

  @IsOptional()
  @IsArray()
  @IsEnum(BookStatus, { each: true })
  @Transform(({ value }) => transformToArray(value))
  public readonly status?: BookStatus[];

  @IsOptional()
  @IsArray()
  @IsEnum(Genre, { each: true })
  @Transform(({ value }) => transformToArray(value))
  public readonly genre?: Genre[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => transformToArray(value))
  public readonly languageCode?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => transformToArray(value))
  public readonly authorId?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => transformToArray(value))
  public readonly ownerCountry?: string[];
}

function transformToArray(value: string) {
  const decoded = decodeURIComponent(value);
  return decoded.split(',');
}
