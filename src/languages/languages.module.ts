import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService],
  imports: [DatabaseModule],
  exports: [LanguagesService],
})
export class LanguagesModule {}
