import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private allowedFields = ['id', 'email'];

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const { password, ...rest } = await this.usersService.findOneByField(
      'id',
      id,
    );
    console.log(password);
    return {
      statusCode: HttpStatus.OK,
      message: rest,
    };
  }

  @Get(':field/:value')
  async findOneByField(
    @Param('field') field: string,
    @Param('value') value: string,
  ) {
    if (!this.allowedFields.includes(field)) {
      throw new BadRequestException('Specified field is not allowed.');
    }

    return {
      statusCode: HttpStatus.OK,
      message: await this.usersService.findOneByField(field, value),
    };
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: await this.usersService.updateByField('id', id, updateUserDto),
    };
  }

  @Patch(':field/:value')
  async updateByfield(
    @Param('field') field: string,
    @Param('value') value: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!this.allowedFields.includes(field)) {
      throw new BadRequestException('Specified field is not allowed.');
    }

    return {
      statusCode: HttpStatus.OK,
      message: await this.usersService.updateByField(
        field,
        value,
        updateUserDto,
      ),
    };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    await this.usersService.deleteByField('id', id);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: null,
    };
  }

  @Delete(':field/:value')
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
