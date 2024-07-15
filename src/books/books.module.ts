import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthorsModule } from '../authors/authors.module';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [DatabaseModule, AuthorsModule, LanguagesModule],
  exports: [BooksService],
})
export class BooksModule {}
