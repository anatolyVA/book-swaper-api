import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { DatabaseModule } from '../database/database.module';
import { CoffeeModule } from '../coffee/coffee.module';
import { BasketItemService } from './basket-item.service';

@Module({
  imports: [DatabaseModule, CoffeeModule],
  controllers: [BasketController],
  providers: [BasketService, BasketItemService],
  exports: [BasketService],
})
export class BasketModule {}
