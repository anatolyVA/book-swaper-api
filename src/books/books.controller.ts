import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CurrentUser, Public } from '../auth/decorators';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';
import { QueryDto } from './dto/query.dto';
import { QueryTransformPipe } from './query-transform.pipe';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto, @CurrentUser() user: User) {
    return this.booksService.create(createBookDto, user.id);
  }

  @Post(':id/upload-images')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions))
  uploadImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.booksService.uploadImages(id, images);
  }

  @Get()
  @Public()
  findAllByQuery(@Query(new QueryTransformPipe()) queryDto: QueryDto) {
    return this.booksService.findAllByQuery(queryDto);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Get(':id/similar')
  @Public()
  findSimilar(@Param('id') id: string) {
    return this.booksService.findSimilar(id);
  }

  //accept
  //decline
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.booksService.remove(id, user);
  }
}
