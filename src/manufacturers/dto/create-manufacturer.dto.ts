import { IsString } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  title: string;

  @IsString()
  country: string;
}
