import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '../auth/decorators';
import { User } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { SwapsService } from '../swaps/swaps.service';
import { BooksService } from '../books/books.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly swapsService: SwapsService,
    private readonly booksService: BooksService,
  ) {}

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return plainToInstance(ResponseUserDto, user); // this.usersService.findOneByField('id', user.id)
  }

  @Get()
  @Public()
  findAll() {
    const users = this.usersService.findAll();
    return plainToInstance(ResponseUserDto, users);
  }

  @Get(':id')
  @Public()
  async findOneById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOneByField('id', id);
    return plainToInstance(ResponseUserDto, user);
  }

  @Patch(':id')
  async updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return plainToInstance(
      ResponseUserDto,
      await this.usersService.updateByField('id', id, updateUserDto, user),
    );
  }

  @Delete(':id')
  async deleteById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.usersService.deleteByField('id', id, user);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: null,
    };
  }

  // @Get('me/swaps')
  // async getSwaps(@Query('type') type: string, @CurrentUser() user: User) {
  //   if (type === 'sent') {
  //     return this.swapsService.findAllSentByUser(user.id);
  //   } else if (type === 'received') {
  //     return this.swapsService.findAllReceivedByUser(user.id);
  //   } else {
  //     return this.swapsService.findAllByUserId(user.id);
  //   }
  // }

  @Get('me/books')
  async getBooks(@CurrentUser() user: User) {
    return this.booksService.findAllByUserId(user.id);
  }
  @Get('me/statistics')
  async getCurrentUserStatistics(@CurrentUser() user: User) {
    return this.usersService.getUserStatistics(user.id);
  }

  @Get(':id/books')
  @Public()
  async getBooksByUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.findAllByUserId(id);
  }

  @Get(':id/statistics')
  async getUserStatistics(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserStatistics(id);
  }
}
