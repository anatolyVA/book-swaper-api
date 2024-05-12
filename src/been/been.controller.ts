import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { BeenService } from './been.service';
import { UpdateBeenDto } from './dto/update-been.dto';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, Public } from '../auth/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('been')
export class BeenController {
  constructor(private readonly beenService: BeenService) {}

  @Get()
  @Public()
  findAll() {
    return this.beenService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.beenService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBeenDto: UpdateBeenDto,
  ) {
    return this.beenService.update(id, updateBeenDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.beenService.remove(id);
  }
}
