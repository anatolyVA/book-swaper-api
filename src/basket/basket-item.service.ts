import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CoffeeService } from '../coffee/coffee.service';
import { BasketService } from './basket.service';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class BasketItemService {
  constructor(
    private db: DatabaseService,
    private coffeeService: CoffeeService,
    private basketService: BasketService,
  ) {}

  async findAll(userId: string) {
    const { id } = await this.basketService.findOneByUserId(userId);

    return this.db.basketItems.findMany({
      where: {
        basketId: id,
      },
      include: {
        coffee: true,
      },
    });
  }

  async findOne(userId: string, coffeeId: string) {
    const basket = await this.basketService.findOneByUserId(userId);
    const item = await this.db.basketItems.findUnique({
      where: {
        basketId_coffeeId: {
          basketId: basket.id,
          coffeeId: coffeeId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async remove(userId: string, id: string) {
    const { basketId, coffeeId } = await this.findOne(userId, id);

    await this.db.basketItems.delete({
      where: {
        basketId_coffeeId: {
          basketId,
          coffeeId,
        },
      },
    });
  }
  async update(userId: string, id: string, updateItemDto: UpdateItemDto) {
    const { basketId, coffeeId } = await this.findOne(userId, id);

    return this.db.basketItems.update({
      where: {
        basketId_coffeeId: {
          basketId,
          coffeeId,
        },
      },
      data: updateItemDto,
    });
  }

  async create(userId: string, createItemDto: CreateItemDto) {
    const basket = await this.basketService.findOneByUserId(userId);
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
      throw new BadRequestException('Item already exists in basket');
    }

    return this.db.basketItems.create({
      data: {
        basketId: basket.id,
        coffeeId: coffee.id,
        quantity: createItemDto.quantity,
      },
    });
  }
}
