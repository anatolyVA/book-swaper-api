import { Module } from '@nestjs/common';
import { SwapsService } from './swaps.service';
import { SwapsController } from './swaps.controller';
import { DatabaseModule } from '../database/database.module';
import { BooksModule } from '../books/books.module';

@Module({
  controllers: [SwapsController],
  providers: [SwapsService],
  imports: [DatabaseModule, BooksModule],
})
export class SwapsModule {}
