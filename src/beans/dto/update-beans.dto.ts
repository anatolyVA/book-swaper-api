import { PartialType } from '@nestjs/swagger';
import { CreateBeansDto } from './create-beans.dto';

export class UpdateBeansDto extends PartialType(CreateBeansDto) {}
