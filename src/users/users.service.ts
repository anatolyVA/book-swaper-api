import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';

import { DatabaseService } from 'src/database/database.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.db.recordsExists(
      'email',
      createUserDto.email,
      this.db.user,
    );
    if (existingUser) {
      throw new ConflictException('Email is already taken.');
    }

    const hashedPassword = await hash(createUserDto.password);
    const { id } = await this.db.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return { id };
  }

  findAll() {
    return this.db.user.findMany();
  }

  async findOneByField(field: string, value: string) {
    const user = await this.db.user.findUnique({
      where: this.db.buildWhereClause(field, value),
    });
    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    return user;
  }

  async updateByField(
    field: string,
    value: string,
    updateUserDto: UpdateUserDto,
  ) {
    const existingUser = await this.db.recordsExists(
      field,
      value,
      this.db.user,
    );
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const isBodyEmpty = Object.keys(updateUserDto).length === 0;
    if (isBodyEmpty) {
      throw new BadRequestException(
        'You must specify at least one of the changing field.',
      );
    }

    const { email, password } = updateUserDto;

    if (email) {
      const existingEmail = await this.db.recordsExists(
        'email',
        updateUserDto.email,
        this.db.user,
      );

      if (existingEmail) {
        throw new ConflictException('Email is alredy taken');
      }
    } else if (password) {
      updateUserDto.password = await hash(password);
    }

    return await this.db.user.update({
      where: this.db.buildWhereClause(field, value),
      data: updateUserDto,
    });
  }

  async deleteByField(field: string, value: string) {
    await this.db.user.delete({
      where: this.db.buildWhereClause(field, value),
    });
  }
}
