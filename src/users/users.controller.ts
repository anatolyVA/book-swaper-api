import {
  BadRequestException,
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
import { CurrentUser, Roles, Public } from '../auth/decorators';
import { Role, User } from '@prisma/client';
import { RolesGuard, JwtAuthGuard } from '../auth/guards';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private allowedFields = ['id', 'email'];

  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return user;
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

  @Get(':field/:value')
  @Public()
  async findOneByField(
    @Param('field') field: string,
    @Param('value') value: string,
  ) {
    if (!this.allowedFields.includes(field)) {
      throw new BadRequestException('Specified field is not allowed.');
    }

    return plainToInstance(
      ResponseUserDto,
      await this.usersService.findOneByField(field, value),
    );
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return plainToInstance(
      ResponseUserDto,
      await this.usersService.updateByField('id', id, updateUserDto),
    );
  }

  @Patch(':field/:value')
  @Roles(Role.ADMIN)
  async updateByfield(
    @Param('field') field: string,
    @Param('value') value: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!this.allowedFields.includes(field)) {
      throw new BadRequestException('Specified field is not allowed.');
    }

    return plainToInstance(
      ResponseUserDto,
      await this.usersService.updateByField(field, value, updateUserDto),
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteById(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.deleteByField('id', id);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: null,
    };
  }

  @Delete(':field/:value')
  @Roles(Role.ADMIN)
  async deleteByField(
    @Param('field') field: string,
    @Param('value') value: string,
  ) {
    if (!this.allowedFields.includes(field)) {
      throw new BadRequestException('Specified field is not allowed.');
    }

    await this.usersService.deleteByField(field, value);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: null,
    };
  }
}
