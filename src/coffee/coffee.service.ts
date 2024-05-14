import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { DatabaseService } from '../database/database.service';
import { BeansService } from '../beans/beans.service';

@Injectable()
export class CoffeeService {
  constructor(
    private db: DatabaseService,
    private beansService: BeansService,
  ) {}

  async create(createCoffeeDto: CreateCoffeeDto) {
    await this.beansService.findOne(createCoffeeDto.beansId);

    return this.db.coffee.create({
      data: createCoffeeDto,
    });
  }

  async findAll() {
    return this.db.coffee.findMany({
      include: {
        beans: {
          include: {
            manufacturer: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const coffee = await this.db.coffee.findUnique({
      where: {
        id,
      },
      include: {
        beans: {
          include: {
            manufacturer: true,
          },
        },
      },
    });

    if (!coffee) {
      throw new NotFoundException('Coffee not found');
    }

    return coffee;
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    await this.findOne(id);

    const isBodyEmpty = Object.keys(updateCoffeeDto).length === 0;
    if (isBodyEmpty) {
      throw new BadRequestException(
        'You must specify at least one of the changing field.',
      );
    }

    const { beansId } = updateCoffeeDto;

    if (beansId) {
      await this.beansService.findOne(beansId);
    }

    return this.db.coffee.update({
      where: {
        id,
      },
      data: updateCoffeeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.coffee.delete({
      where: {
        id,
      },
    });
  }
}
