import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DatabaseService } from '../database/database.service';
import { BookStatus, Prisma, User } from '@prisma/client';
import { AuthorsService } from '../authors/authors.service';
import * as fs from 'node:fs';
import { LanguagesService } from '../languages/languages.service';
import { QueryDto } from './dto/query.dto';

type BookWhereInput = Prisma.BookWhereInput;

@Injectable()
export class BooksService {
  constructor(
    private readonly db: DatabaseService,
    private readonly authorService: AuthorsService,
    private readonly languagesService: LanguagesService,
  ) {}

  private readonly include: Prisma.BookInclude = {
    author: true,
    images: true,
    language: true,
    owner: { select: { profile: true, id: true, password: false } },
  };

  async create(createBookDto: CreateBookDto, ownerId: string) {
    const { authorId } = createBookDto;
    await this.authorService.findOne(authorId);
    await this.languagesService.findOne(createBookDto.languageCode);

    return this.db.book.create({
      data: {
        ...createBookDto,
        ownerId,
      },
      include: this.include,
    });
  }

  async uploadImages(id: string, images: Express.Multer.File[]) {
    const book = await this.findOne(id);
    return this.db.bookImage.createManyAndReturn({
      data: images.map((image, index) => ({
        path: image.path,
        bookId: book.id,
        isPreview: index === 0,
      })),
    });
  }

  async findAll() {
    return this.db.book.findMany({
      include: this.include,
    });
  }

  async findOne(id: string) {
    const book = await this.db.book.findUnique({
      where: { id },
      include: this.include,
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async findAllByUserId(userId: string) {
    return this.db.book.findMany({
      where: { ownerId: userId },
      include: this.include,
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto, user: User) {
    const book = await this.findOne(id);

    if (book.ownerId !== user.id || !user.role.includes('ADMIN')) {
      throw new ForbiddenException('Access denied');
    }

    return this.db.book.update({
      where: { id },
      data: updateBookDto,
      include: this.include,
    });
  }

  async updateStatus(id: string, status: BookStatus) {
    await this.findOne(id);
    return this.db.book.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string, user: User) {
    const book = await this.findOne(id);

    if (book.ownerId !== user.id && !user.role.includes('ADMIN')) {
      throw new ForbiddenException('Access denied');
    }

    const { images } = book;
    images.forEach((value) => {
      fs.unlinkSync(value.path);
    });

    return this.db.book.delete({ where: { id } });
  }

  async findAllByQuery(queryDto: QueryDto) {
    const {
      offset,
      limit,
      search,
      ownerCountry,
      condition,
      genre,
      languageCode,
      authorId,
      coverType,
    } = queryDto;

    const where: BookWhereInput = {
      genre: {
        in: genre,
      },
      status: BookStatus.AVAILABLE,
      condition: {
        in: condition,
      },
      languageCode: {
        in: languageCode,
      },
      authorId: {
        in: authorId,
      },
      coverType: {
        in: coverType,
      },
      title: {
        contains: search,
        mode: 'insensitive',
      },
      owner: {
        profile: {
          country: {
            in: ownerCountry,
          },
        },
      },
    };

    const result = await this.db.book.findMany({
      where,
      take: limit,
      skip: offset,
      include: this.include,
    });

    const count = await this.db.book.count({
      where,
    });

    return {
      books: result,
      total: count,
    };
  }

  async findSimilar(id: string) {
    const book = await this.findOne(id);
    return this.db.book.findMany({
      where: {
        genre: book.genre,
        coverType: book.coverType,
        condition: book.condition,
        languageCode: book.languageCode,
        status: BookStatus.AVAILABLE,
        NOT: { id },
      },
      include: this.include,
    });
  }
}
