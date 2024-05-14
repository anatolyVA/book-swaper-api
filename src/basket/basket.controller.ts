import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BasketItemService } from './basket-item.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('basket')
export class BasketController {
  constructor(
    private readonly basketService: BasketService,
    private readonly basketItemService: BasketItemService,
  ) {}

  @Get()
  getUserBasket(@CurrentUser() user: User) {
    return this.basketService.findOneByUserId(user.id);
  }

  // @Get(':id')
  // @Roles(Role.ADMIN)
  // findOne(@Param('id') id: string) {
  //   return this.basketService.findOne(id);
  // }
  //
  // @Delete(':id')
  // @Roles(Role.ADMIN)
  // remove(@Param('id') id: string) {
  //   return this.basketService.remove(id);
  // }

  @Post('/items')
  addItemToBasket(
    @CurrentUser() user: User,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.basketItemService.create(user.id, createItemDto);
  }

  @Get('/items')
  findAllBasketItems(@CurrentUser() user: User) {
    return this.basketItemService.findAll(user.id);
  }

  @Get('/items/:id')
  findBasketItem(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.basketItemService.findOne(user.id, id);
  }

  @Patch('/items/:id')
  updateBasketItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
    @CurrentUser() user: User,
  ) {
    return this.basketItemService.update(user.id, id, updateItemDto);
  }

  @Delete('/items/:id')
  removeBasketItem(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.basketItemService.remove(user.id, id);
  }

  @Delete('/items')
  clearBasket(@CurrentUser() user: User) {
    return this.basketService.clear(user.id);
  }
}
