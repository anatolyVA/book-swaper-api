import { IsNumber } from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  quantity: number;
}
