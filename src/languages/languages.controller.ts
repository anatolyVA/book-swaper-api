import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Public, Roles } from '../auth/decorators';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Post('many')
  @Roles(Role.ADMIN)
  createMany(@Body() languages: CreateLanguageDto[]) {
    return this.languagesService.createMany(languages);
  }

  @Get()
  @Public()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':code')
  @Public()
  findOne(@Param('code') code: string) {
    return this.languagesService.findOne(code);
  }

  @Patch(':code')
  @Roles(Role.ADMIN)
  update(
    @Param('code') code: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(code, updateLanguageDto);
  }

  @Delete(':code')
  @Roles(Role.ADMIN)
  remove(@Param('code') code: string) {
    return this.languagesService.remove(code);
  }
}
