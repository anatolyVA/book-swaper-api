import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SwapsModule } from '../swaps/swaps.module';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [DatabaseModule, SwapsModule, BooksModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
