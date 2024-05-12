import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

import { BeenService } from '../been/been.service';
import { CreateBeenDto } from '../been/dto/create-been.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, Public } from '../auth/decorators';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('manufacturers')
export class ManufacturersController {
  constructor(
    private readonly manufacturersService: ManufacturersService,
    private readonly beenService: BeenService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturersService.create(createManufacturerDto);
  }

  @Post(':id/been')
  @Roles(Role.ADMIN)
  createBeen(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createBeenDto: CreateBeenDto,
  ) {
    return this.beenService.create(id, createBeenDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.manufacturersService.findAll();
  }

  @Get(':id/been')
  @Public()
  findAllBeen(@Param('id', ParseUUIDPipe) id: string) {
    return this.beenService.findAllByManufacturer(id);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.manufacturersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.manufacturersService.remove(id);
  }
}
