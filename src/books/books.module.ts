import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthorsModule } from '../authors/authors.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [DatabaseModule, AuthorsModule],
  exports: [BooksService],
})
export class BooksModule {}
