import { IsEnum } from 'class-validator';

enum Status {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
export class UpdateSwapRequestDto {
  @IsEnum(Status)
  status: Status;
}
