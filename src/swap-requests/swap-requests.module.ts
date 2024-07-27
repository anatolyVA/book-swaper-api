import { Module } from '@nestjs/common';
import { SwapRequestsService } from './swap-requests.service';
import { SwapRequestsController } from './swap-requests.controller';
import { DatabaseModule } from '../database/database.module';
import { BooksModule } from '../books/books.module';
import { UsersModule } from '../users/users.module';
import { SwapsModule } from '../swaps/swaps.module';

@Module({
  controllers: [SwapRequestsController],
  providers: [SwapRequestsService],
  imports: [DatabaseModule, BooksModule, UsersModule, SwapsModule],
})
export class SwapRequestsModule {}
