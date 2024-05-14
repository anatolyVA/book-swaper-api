import { Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { CoffeeService } from '../coffee/coffee.service';

@Injectable()
export class BasketService {
  constructor(
    private db: DatabaseService,
    private coffeeService: CoffeeService,
  ) {}

  async findAll() {
    return this.db.basket.findMany({
      include: {
        basketItems: true,
      },
    });
  }

  async clear(userId: string) {
    const { id } = await this.findOneByUserId(userId);
    await this.db.basketItems.deleteMany({
      where: {
        basketId: id,
      },
    });
  }

  async findOneByUserId(userId: string) {
    const basket = await this.db.basket.findUnique({
      where: {
        userId: userId,
      },
      include: {
        _count: {
          select: { basketItems: true },
        },
      },
    });

    console.log(userId);

    if (!basket) {
      throw new NotFoundException('Basket not found');
    }

    return basket;
  }
}
