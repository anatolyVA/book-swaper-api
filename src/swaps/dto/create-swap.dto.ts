import { IsString, IsUUID } from 'class-validator';

export class CreateSwapDto {
  @IsUUID()
  @IsString()
  offeringBookId: string;

  @IsUUID()
  @IsString()
  requestedBookId: string;
}
