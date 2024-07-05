import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { SwapsModule } from './swaps/swaps.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    AuthorsModule,
    BooksModule,
    SwapsModule,
  ],
})
export class AppModule {}
