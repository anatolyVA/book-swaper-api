import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LanguagesService {
  constructor(private readonly db: DatabaseService) {}
  async create(createLanguageDto: CreateLanguageDto) {
    const { code } = createLanguageDto;
    await this.findOne(code);

    return this.db.language.create({ data: createLanguageDto });
  }

  async createMany(languages: CreateLanguageDto[]) {
    return this.db.language.createMany({ data: languages });
  }

  findAll() {
    return this.db.language.findMany();
  }

  async findOne(code: string) {
    const language = await this.db.language.findUnique({ where: { code } });
    if (!language) {
      throw new NotFoundException('Language not found');
    }
    return language;
  }

  async update(code: string, updateLanguageDto: UpdateLanguageDto) {
    await this.findOne(code);
    return this.db.language.update({
      where: { code },
      data: updateLanguageDto,
    });
  }

  async remove(code: string) {
    await this.findOne(code);
    return this.db.language.delete({ where: { code } });
  }
}
