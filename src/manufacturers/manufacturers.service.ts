import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class ManufacturersService {
  constructor(private db: DatabaseService) {}

  async create(createManufacturerDto: CreateManufacturerDto) {
    return this.db.manufacturer.create({
      data: createManufacturerDto,
    });
  }

  async findAll() {
    return this.db.manufacturer.findMany();
  }

  async findOne(id: string) {
    const manufacturer = await this.db.manufacturer.findUnique({
      where: {
        id,
      },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return manufacturer;
  }

  async update(id: string, updateManufacturerDto: UpdateManufacturerDto) {
    await this.findOne(id);

    const isBodyEmpty = Object.keys(updateManufacturerDto).length === 0;
    if (isBodyEmpty) {
      throw new BadRequestException(
        'You must specify at least one of the changing field.',
      );
    }

    return this.db.manufacturer.update({
      where: {
        id: id,
      },
      data: updateManufacturerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db.manufacturer.delete({
      where: {
        id: id,
      },
    });

    return null;
  }
}
