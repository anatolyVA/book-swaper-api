import { PartialType } from '@nestjs/swagger';
import { CreateBeenDto } from './create-been.dto';

export class UpdateBeenDto extends PartialType(CreateBeenDto) {}
