import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateBeenDto } from './dto/create-been.dto';

import { UpdateBeenDto } from './dto/update-been.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BeenService {
  constructor(private db: DatabaseService) {}

  async create(manufacturerId: string, createBeenDto: CreateBeenDto) {
    const isManufacturerExist = await this.db.manufacturer.findUnique({
      where: { id: manufacturerId },
    });

    if (!isManufacturerExist) {
      throw new NotFoundException('Manufacturer not found');
    }

    return this.db.been.create({
      data: {
        ...createBeenDto,
        manufacturerId: manufacturerId,
      },
    });
  }

  async findAll() {
    return this.db.been.findMany();
  }

  async findAllByManufacturer(manufacturerId: string) {
    return this.db.been.findMany({
      where: {
        manufacturerId: manufacturerId,
      },
    });
  }

  async findOne(id: string) {
    const been = await this.db.been.findUnique({
      where: {
        id: id,
      },
    });

    if (!been) {
      throw new NotFoundException('Been not found');
    }

    return been;
  }

  async update(id: string, updateBeenDto: UpdateBeenDto) {
    await this.findOne(id);

    const isBodyEmpty = Object.keys(updateBeenDto).length === 0;
    if (isBodyEmpty) {
      throw new BadRequestException(
        'You must specify at least one of the changing field.',
      );
    }

    return this.db.been.update({
      where: {
        id: id,
      },
      data: updateBeenDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.been.delete({
      where: {
        id: id,
      },
    });
    return null;
  }
}
