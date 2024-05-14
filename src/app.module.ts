import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { BeansModule } from './beans/beans.module';
import { CoffeeModule } from './coffee/coffee.module';
import { BasketModule } from './basket/basket.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    ManufacturersModule,
    BeansModule,
    CoffeeModule,
    BasketModule,
  ],
})
export class AppModule {}
