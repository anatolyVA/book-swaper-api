import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SwapRequestsService } from './swap-requests.service';
import { CreateSwapRequestDto } from './dto/create-swap-request.dto';
import { UpdateSwapRequestDto } from './dto/update-swap-request.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { User } from '@prisma/client';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('swap-requests')
export class SwapRequestsController {
  constructor(private readonly swapRequestsService: SwapRequestsService) {}

  @Post()
  create(
    @Body() createSwapRequestDto: CreateSwapRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.swapRequestsService.create(createSwapRequestDto, user.id);
  }

  @Get()
  findByUserAll(@CurrentUser() user: User) {
    return this.swapRequestsService.findAllByUserId(user.id);
  }

  @Get('/received')
  findAllReceived(@CurrentUser() user: User) {
    return this.swapRequestsService.findAllReceivedByUserId(user.id);
  }

  @Get('/sent')
  findAllSent(@CurrentUser() user: User) {
    return this.swapRequestsService.findAllSentByUserId(user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.swapRequestsService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSwapRequestDto: UpdateSwapRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.swapRequestsService.update(id, updateSwapRequestDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.swapRequestsService.remove(id, user);
  }
}
