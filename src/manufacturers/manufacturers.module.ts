import { Module } from '@nestjs/common';

import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';

import { DatabaseModule } from '../database/database.module';
import { BeansModule } from '../beans/beans.module';

@Module({
  imports: [DatabaseModule, BeansModule],
  controllers: [ManufacturersController],
  providers: [ManufacturersService],
})
export class ManufacturersModule {}
