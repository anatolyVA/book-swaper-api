import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { User } from '@prisma/client';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('/books/:bookId')
  addToFavorite(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.addToFavorite({ bookId, userId: user.id });
  }

  @Get('/books')
  findAllBooks(@CurrentUser() user: User) {
    return this.favoritesService.findAllFavoriteBooksByUserId(user.id);
  }

  @Get('/books/:bookId')
  findOneBook(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.findOneFavoriteBookByUserId(bookId, user.id);
  }

  @Delete('/books/:bookId')
  removeBook(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.unFavoriteBook(bookId, user.id);
  }
}
