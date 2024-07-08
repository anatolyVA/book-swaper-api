import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSwapDto } from './dto/create-swap.dto';
import { UpdateSwapDto } from './dto/update-swap.dto';
import { DatabaseService } from '../database/database.service';
import { BooksService } from '../books/books.service';
import { Book, User } from '@prisma/client';

@Injectable()
export class SwapsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly booksService: BooksService,
  ) {}
  async create(createSwapDto: CreateSwapDto, userId: string) {
    const { offeringBookId, requestedBookId } = createSwapDto;
    const offeringBook = await this.booksService.findOne(offeringBookId);
    const requestedBook = await this.booksService.findOne(requestedBookId);

    if (offeringBook.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (requestedBook.ownerId === userId) {
      throw new BadRequestException("You can't swap books with yourself");
    }

    return this.db.swap.create({
      data: createSwapDto,
    });
  }

  async findAll() {
    return this.db.swap.findMany();
  }

  async findOne(id: string) {
    const swap = await this.db.swap.findUnique({
      where: { id },
      include: {
        offeringBook: true,
        requestedBook: true,
      },
    });

    if (!swap) {
      throw new NotFoundException('Swap not found');
    }

    return swap;
  }

  async findAllSentByUser(userId: string) {
    return this.db.swap.findMany({
      where: {
        offeringBook: {
          owner: {
            id: userId,
          },
        },
      },
    });
  }

  async findAllReceivedByUser(userId: string) {
    return this.db.swap.findMany({
      where: {
        requestedBook: {
          owner: {
            id: userId,
          },
        },
      },
    });
  }

  async findAllByUserId(userId: string) {
    return this.db.swap.findMany({
      where: {
        OR: [
          {
            offeringBook: {
              owner: {
                id: userId,
              },
            },
          },
          {
            requestedBook: {
              owner: {
                id: userId,
              },
            },
          },
        ],
      },
    });
  }

  async update(id: string, updateSwapDto: UpdateSwapDto, user: User) {
    const swap = await this.findOne(id);
    if (
      this.checkAccess(user, swap.offeringBook) ||
      swap.requestedBook.ownerId !== user.id
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.db.swap.update({
      where: { id },
      data: updateSwapDto,
    });
  }

  async remove(id: string, user: User) {
    const swap = await this.findOne(id);
    if (this.checkAccess(user, swap.offeringBook)) {
      throw new ForbiddenException('Access denied');
    }
    return this.db.swap.delete({ where: { id } });
  }

  private checkAccess(user: User, offeringBook: Book) {
    return !(offeringBook.ownerId !== user.id || !user.role.includes('ADMIN'));
  }
}
