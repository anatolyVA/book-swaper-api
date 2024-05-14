import { Module } from '@nestjs/common';

import { BeansService } from './beans.service';
import { BeansController } from './beans.controller';

import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BeansController],
  providers: [BeansService],
  exports: [BeansService],
})
export class BeansModule {}
