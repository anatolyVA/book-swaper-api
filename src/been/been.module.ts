import { Module } from '@nestjs/common';

import { BeenService } from './been.service';
import { BeenController } from './been.controller';

import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BeenController],
  providers: [BeenService],
  exports: [BeenService],
})
export class BeenModule {}
