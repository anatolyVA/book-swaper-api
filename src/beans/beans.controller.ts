import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { BeansService } from './beans.service';
import { UpdateBeansDto } from './dto/update-beans.dto';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Public, Roles } from '../auth/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('beans')
export class BeansController {
  constructor(private readonly beansService: BeansService) {}

  @Get()
  @Public()
  findAll() {
    return this.beansService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.beansService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBeenDto: UpdateBeansDto,
  ) {
    return this.beansService.update(id, updateBeenDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.beansService.remove(id);
  }
}
