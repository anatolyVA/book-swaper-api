import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { BooksService } from '../books/books.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly booksService: BooksService,
  ) {}

  async addToFavorite(createFavoriteDto: CreateFavoriteDto) {
    const { userId, bookId } = createFavoriteDto;

    const book = await this.booksService.findOne(bookId);

    const isFavorite = await this.checkIsFavorite(userId, bookId);
    if (isFavorite) {
      throw new BadRequestException('Book is already in favorites');
    }

    return this.db.favoriteBook.create({
      data: {
        userId,
        bookId,
      },
    });
  }

  async findAllFavoriteBooksByUserId(id: string) {
    const favoriteBooks = await this.db.favoriteBook.findMany({
      where: {
        userId: id,
      },
      include: {
        book: {
          include: this.booksService.include,
        },
      },
    });

    return favoriteBooks.flatMap((fav) => fav.book);
  }
  async unFavoriteBook(id: string, userId: string) {
    const favoriteBook = await this.findOneFavoriteBookByUserId(id, userId);
    return this.db.favoriteBook.delete({
      where: {
        userId_bookId: favoriteBook,
      },
    });
  }

  async findOneFavoriteBookByUserId(bookId: string, userId: string) {
    const favoriteBook = await this.db.favoriteBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
    if (!favoriteBook) {
      throw new NotFoundException('Book is not in favorites');
    }

    return favoriteBook;
  }

  async checkIsFavorite(userId: string, bookId: string) {
    const favoriteBook = await this.db.favoriteBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
    return !!favoriteBook;
  }
}
