import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

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

  async addItemToBasket(userId: string, createItemDto: CreateItemDto) {
    const basket = await this.findBasketByUserId(userId);
    const coffee = await this.coffeeService.findOne(createItemDto.coffeeId);

    const basketItem = await this.db.basketItems.findUnique({
      where: {
        basketId_coffeeId: {
          basketId: basket.id,
          coffeeId: coffee.id,
        },
      },
    });

    if (basketItem) {
      return this.updateBasketItem(userId, coffee.id, {
        ...basketItem,
        quantity: basketItem.quantity + createItemDto.quantity,
      });
    }

    return this.db.basketItems.create({
      data: {
        basketId: basket.id,
        coffeeId: coffee.id,
        quantity: createItemDto.quantity,
      },
    });
  }

  async updateBasketItem(
    userId: string,
    id: string,
    updateItemDto: UpdateItemDto,
  ) {
    const basket = await this.findBasketByUserId(userId);
    const item = await this.findBasketItem(basket.id, id);

    return this.db.basketItems.update({
      where: {
        basketId_coffeeId: item,
      },
      data: updateItemDto,
    });
  }

  async removeBasketItem(userId: string, id: string) {
    const basket = await this.findBasketByUserId(userId);
    const item = await this.findBasketItem(basket.id, id);

    await this.db.basketItems.delete({
      where: {
        basketId_coffeeId: item,
      },
    });
  }

  async clearBasket(userId: string) {
    const { id } = await this.findBasketByUserId(userId);
    await this.db.basketItems.deleteMany({
      where: {
        basketId: id,
      },
    });
  }

  async findBasketItem(userId: string, coffeeId: string) {
    const basket = await this.findBasketByUserId(userId);
    const item = await this.db.basketItems.findUnique({
      where: {
        basketId_coffeeId: {
          basketId: basket.id,
          coffeeId: coffeeId,
        },
      },
      include: {
        coffee: {
          include: {
            been: {
              include: {
                manufacturer: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async findBasketByUserId(userId: string) {
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

    if (!basket) {
      throw new NotFoundException('Basket not found');
    }

    return basket;
  }

  async findAllBasketItemsByUserId(userId: string) {
    const { id } = await this.findBasketByUserId(userId);

    return this.db.basketItems.findMany({
      where: {
        basketId: id,
      },
      include: {
        coffee: true,
      },
    });
  }
}
