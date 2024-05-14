import { IsString } from 'class-validator';

export class CreateBeansDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
