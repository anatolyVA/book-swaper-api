import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [DatabaseModule],
  exports: [BooksService],
})
export class BooksModule {}
