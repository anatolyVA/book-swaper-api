import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService],
  imports: [DatabaseModule],
  exports: [AuthorsService],
})
export class AuthorsModule {}
