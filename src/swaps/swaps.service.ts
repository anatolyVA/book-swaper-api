import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class SwapsService {
  constructor(private readonly db: DatabaseService) {}

  private readonly responseInclude: Prisma.SwapInclude = {
    request: {
      include: {
        offeredBook: {
          include: {
            owner: true,
            author: true,
            language: true,
            images: true,
          },
        },
        requestedBook: {
          include: {
            owner: true,
            author: true,
            language: true,
            images: true,
          },
        },
      },
    },
  };

  async create(swapRequestId: string) {
    return this.db.swap.create({
      data: {
        swapRequestId,
      },
    });
  }

  async findAll() {
    return this.db.swap.findMany();
  }

  async findOne(id: string) {
    const swap = await this.db.swap.findUnique({
      where: { id },
      include: this.responseInclude,
    });

    if (!swap) {
      throw new NotFoundException('Swap not found');
    }

    return swap;
  }

  async remove(id: string, user: User) {
    await this.findOne(id);
    console.log(user);
    return this.db.swap.delete({ where: { id } });
  }
}
