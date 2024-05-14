import { CoffeeType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  imageUrl: string | null;

  @IsUUID()
  beansId: string;

  @IsEnum(CoffeeType)
  type: CoffeeType;
}
