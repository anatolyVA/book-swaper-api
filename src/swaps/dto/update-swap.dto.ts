import { SwapStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateSwapDto {
  @IsEnum(SwapStatus)
  @IsOptional()
  status: SwapStatus;
}
