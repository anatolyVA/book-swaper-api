import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { DatabaseModule } from '../database/database.module';
import { BooksModule } from '../books/books.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [DatabaseModule, BooksModule],
})
export class FavoritesModule {}
