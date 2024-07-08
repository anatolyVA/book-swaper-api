import {
  IsEmail,
  IsNotEmptyObject,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsString()
  country: string;

  @IsString()
  city: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
