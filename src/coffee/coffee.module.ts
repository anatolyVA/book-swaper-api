import { Module } from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CoffeeController } from './coffee.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CoffeeController],
  providers: [CoffeeService],
  exports: [CoffeeService],
})
export class CoffeeModule {}
