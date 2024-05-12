import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BasketModule } from '../basket/basket.module';

@Module({
  imports: [DatabaseModule, BasketModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
