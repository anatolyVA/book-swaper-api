import { Module } from '@nestjs/common';

import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';

import { DatabaseModule } from '../database/database.module';
import { BeenModule } from '../been/been.module';

@Module({
  imports: [DatabaseModule, BeenModule],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
})
export class ManufacturersModule {}
