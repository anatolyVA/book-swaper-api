import { IsString } from 'class-validator';

export class CreateBeenDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
