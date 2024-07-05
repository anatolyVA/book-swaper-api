import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthorsService {
  constructor(private db: DatabaseService) {}
  async create(createAuthorDto: CreateAuthorDto) {
    return this.db.author.create({
      data: createAuthorDto,
    });
  }

  async findAll() {
    return this.db.author.findMany();
  }

  async findOne(id: string) {
    const author = await this.db.author.findUnique({ where: { id } });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    await this.findOne(id);
    return this.db.author.update({
      where: { id },
      data: updateAuthorDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.author.delete({ where: { id } });
  }
}
