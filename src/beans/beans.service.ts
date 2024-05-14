import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateBeansDto } from './dto/create-beans.dto';

import { UpdateBeansDto } from './dto/update-beans.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BeansService {
  constructor(private db: DatabaseService) {}

  async create(manufacturerId: string, createBeansDto: CreateBeansDto) {
    const isManufacturerExist = await this.db.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!isManufacturerExist) {
      throw new NotFoundException('Manufacturer not found');
    }

    return this.db.beans.create({
      data: {
        ...createBeansDto,
        manufacturerId: manufacturerId,
      },
    });
  }

  async findAll() {
    return this.db.beans.findMany();
  }

  async findAllByManufacturer(manufacturerId: string) {
    return this.db.beans.findMany({
      where: {
        manufacturerId: manufacturerId,
      },
    });
  }

  async findOne(id: string) {
    const beans = await this.db.beans.findUnique({
      where: {
        id: id,
      },
    });

    if (!beans) {
      throw new NotFoundException('beans not found');
    }

    return beans;
  }

  async update(id: string, updateBeansDto: UpdateBeansDto) {
    await this.findOne(id);

    const isBodyEmpty = Object.keys(updateBeansDto).length === 0;
    if (isBodyEmpty) {
      throw new BadRequestException(
        'You must specify at least one of the changing field.',
      );
    }

    return this.db.beans.update({
      where: {
        id: id,
      },
      data: updateBeansDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.beans.delete({
      where: {
        id: id,
      },
    });
    return null;
  }
}
