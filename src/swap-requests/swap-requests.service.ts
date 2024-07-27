import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSwapRequestDto } from './dto/create-swap-request.dto';
import { UpdateSwapRequestDto } from './dto/update-swap-request.dto';
import { DatabaseService } from '../database/database.service';
import { BooksService } from '../books/books.service';
import { Prisma, Role, User } from '@prisma/client';
import { SwapsService } from '../swaps/swaps.service';

@Injectable()
export class SwapRequestsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly booksService: BooksService,
    private readonly swapsService: SwapsService,
  ) {}

  private readonly include: Prisma.SwapRequestInclude = {
    offeredBook: {
      include: {
        owner: { select: { id: true, profile: true, password: false } },
        author: true,
        language: true,
        images: true,
      },
    },
    requestedBook: {
      include: {
        owner: { select: { id: true, profile: true, password: false } },
        author: true,
        language: true,
        images: true,
      },
    },
  };

  async create(
    createSwapRequestDto: CreateSwapRequestDto,
    requesterId: string,
  ) {
    const { offeredBookId, requestedBookId } = createSwapRequestDto;

    const requestedBook = await this.booksService.findOne(requestedBookId);
    const offeredBook = await this.booksService.findOne(offeredBookId);

    if (offeredBook.ownerId !== requesterId) {
      throw new ForbiddenException('Access denied');
    }
    if (requestedBook.ownerId === requesterId) {
      throw new BadRequestException("You can't swap books with yourself");
    }
    await this.validateAvailability(offeredBookId, requestedBookId);

    const request = await this.db.swapRequest.findUnique({
      where: {
        requestedBookId_offeredBookId_requesterId_recipientId: {
          requestedBookId,
          offeredBookId,
          requesterId,
          recipientId: requestedBook.owner.id,
        },
      },
    });
    if (request) {
      throw new BadRequestException('Swap request already exists');
    }

    const received = await this.db.swapRequest.findUnique({
      where: {
        requestedBookId_offeredBookId_requesterId_recipientId: {
          requestedBookId: offeredBookId,
          offeredBookId: requestedBookId,
          requesterId: requestedBook.owner.id,
          recipientId: requesterId,
        },
      },
    });
    if (received) {
      throw new BadRequestException('You have already received an swap offer');
    }

    return this.db.swapRequest.create({
      data: {
        offeredBookId,
        requestedBookId,
        requesterId,
        recipientId: requestedBook.owner.id,
      },
      include: this.include,
    });
  }

  async findAll() {
    return this.db.swapRequest.findMany();
  }

  async findOne(id: string) {
    const request = await this.db.swapRequest.findUnique({
      where: {
        id,
      },
      include: this.include,
    });
    if (!request) {
      throw new NotFoundException('Swap request not found');
    }

    return request;
  }

  async update(
    id: string,
    updateSwapRequestDto: UpdateSwapRequestDto,
    user: User,
  ) {
    const { status } = updateSwapRequestDto;
    const request = await this.findOne(id);

    if (request.recipientId !== user.id && !user.role.includes(Role.ADMIN)) {
      throw new ForbiddenException('Access denied');
    }

    if (status === 'ACCEPTED') {
      await this.validateAvailability(
        request.offeredBookId,
        request.requestedBookId,
      );
      await this.booksService.updateStatus(request.requestedBookId, 'IN_SWAP');
      await this.booksService.updateStatus(request.offeredBookId, 'IN_SWAP');
      await this.swapsService.create(request.id);
    }

    return this.db.swapRequest.update({
      where: { id },
      data: updateSwapRequestDto,
      include: this.include,
    });
  }

  async remove(id: string, user: User) {
    const request = await this.findOne(id);

    if (request.requesterId !== user.id && !user.role.includes(Role.ADMIN)) {
      throw new ForbiddenException('Access denied');
    }

    return this.db.swapRequest.delete({ where: { id } });
  }

  async findAllByUserId(id: string) {
    return this.db.swapRequest.findMany({
      where: {
        OR: [
          {
            recipientId: id,
          },
          {
            requesterId: id,
          },
        ],
      },
      include: this.include,
    });
  }

  async findAllReceivedByUserId(id: string) {
    return this.db.swapRequest.findMany({
      where: {
        recipientId: id,
      },
      include: this.include,
    });
  }

  async findAllSentByUserId(id: string) {
    return this.db.swapRequest.findMany({
      where: {
        requesterId: id,
      },
      include: this.include,
    });
  }

  async validateAvailability(offeredBookId: string, requestedBookId: string) {
    const offeredBook = await this.booksService.findOne(offeredBookId);
    const requestedBook = await this.booksService.findOne(requestedBookId);
    if (offeredBook.status !== 'AVAILABLE') {
      throw new BadRequestException('Offered book is not available');
    }
    if (requestedBook.status !== 'AVAILABLE') {
      throw new BadRequestException('Requested book is not available');
    }
  }
}
