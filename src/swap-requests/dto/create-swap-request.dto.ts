import { IsString, IsUUID } from 'class-validator';

export class CreateSwapRequestDto {
  @IsUUID()
  @IsString()
  offeredBookId: string;

  @IsUUID()
  @IsString()
  requestedBookId: string;
}
