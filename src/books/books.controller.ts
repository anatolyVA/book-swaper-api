import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CurrentUser, Public } from '../auth/decorators';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import { v4 } from 'uuid';

const EXTENSIONS = ['.jpeg', '.jpg', '.png', '.webp'];
const MAX_SIZE = 5 * 1024 * 1024;

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const filename: string = v4();
          const extension = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
      limits: {
        fileSize: MAX_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!EXTENSIONS.includes(path.extname(file.originalname))) {
          return cb(
            new BadRequestException(
              'Only images with extensions: jpeg, jpg, png, webp are allowed',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() user: User,
    @UploadedFiles()
    images: Express.Multer.File[],
  ) {
    return this.booksService.create(createBookDto, user.id, images);
  }

  @Get()
  @Public()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() user: User,
  ) {
    return this.booksService.update(id, updateBookDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.booksService.remove(id, user);
  }
}
