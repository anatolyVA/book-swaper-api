import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';

import { DatabaseService } from 'src/database/database.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

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
    return this.db.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        profile: {
          create: createUserDto.profile,
        },
      },
    });
  }

  async findAll() {
    return this.db.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async findOneByField(field: string, value: string) {
    const user = await this.db.user.findUnique({
      where: this.db.buildWhereClause(field, value),
      include: {
        profile: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User was not found.');
    }

    return user;
  }
  async findOne(id: string) {
    const user = await this.db.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
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
    user: User,
  ) {
    const userToUpdate = await this.findOneByField(field, value);
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    if (userToUpdate.id !== user.id) {
      throw new ForbiddenException('Access denied');
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

    return this.db.user.update({
      where: this.db.buildWhereClause(field, value),
      data: {
        ...updateUserDto,
        profile: {
          update: updateUserDto.profile,
        },
      },
    });
  }

  async deleteByField(field: string, value: string, user: User) {
    const userToDelete = await this.findOneByField(field, value);

    if (userToDelete.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    await this.db.user.delete({
      where: this.db.buildWhereClause(field, value),
    });
  }
}
