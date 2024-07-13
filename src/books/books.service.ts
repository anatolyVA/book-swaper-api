import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DatabaseService } from '../database/database.service';
import { User } from '@prisma/client';
import { AuthorsService } from '../authors/authors.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly db: DatabaseService,
    private readonly authorService: AuthorsService,
  ) {}

  async create(createBookDto: CreateBookDto, ownerId: string) {
    const { authorId } = createBookDto;
    await this.authorService.findOne(authorId);

    return this.db.book.create({
      data: {
        ...createBookDto,
        ownerId,
      },
      include: {
        author: true,
        images: true,
        owner: { include: { profile: true } },
      },
    });
  }

  async findAll() {
    return this.db.book.findMany({
      include: {
        author: true,
        images: true,
        owner: { include: { profile: true } },
      },
    });
  }

  async findOne(id: string) {
    const book = await this.db.book.findUnique({
      where: { id },
      include: {
        author: true,
        images: true,
        owner: { include: { profile: true } },
      },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async findAllByUserId(userId: string) {
    return this.db.book.findMany({
      where: { ownerId: userId },
      include: {
        author: true,
        images: true,
        owner: { include: { profile: true } },
      },
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
      include: {
        author: true,
        images: true,
        owner: { include: { profile: true } },
      },
    });
  }

  async remove(id: string, user: User) {
    const book = await this.findOne(id);

    if (book.ownerId !== user.id || !user.role.includes('ADMIN')) {
      throw new ForbiddenException('Access denied');
    }
    return this.db.book.delete({ where: { id } });
  }
}
