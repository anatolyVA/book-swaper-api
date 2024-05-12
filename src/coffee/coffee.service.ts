import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CoffeeService {
  constructor(private db: DatabaseService) {}

  async create(createCoffeeDto: CreateCoffeeDto) {
    await this.checkBeenExisting(createCoffeeDto.beenId);

    return this.db.coffee.create({
      data: createCoffeeDto,
    });
  }

  async findAll() {
    return this.db.coffee.findMany();
  }

  async findOne(id: string) {
    const coffee = await this.db.coffee.findUnique({
      where: {
        id: id,
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

    const { beenId } = updateCoffeeDto;

    if (beenId) {
      await this.checkBeenExisting(beenId);
    }

    return this.db.coffee.update({
      where: {
        id: id,
      },
      data: updateCoffeeDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.coffee.delete({
      where: {
        id: id,
      },
    });
  }

  private async checkBeenExisting(id: string) {
    const been = await this.db.been.findUnique({
      where: {
        id: id,
      },
    });
    if (!been) {
      throw new NotFoundException('Been not found');
    }
    return true;
  }
}
