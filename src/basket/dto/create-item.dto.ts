import { IsNumber, IsUUID } from 'class-validator';

export class CreateItemDto {
  @IsUUID()
  coffeeId: string;

  @IsNumber()
  quantity: number;
}
