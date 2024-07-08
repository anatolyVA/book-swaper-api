import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  patronym?: string;
}
