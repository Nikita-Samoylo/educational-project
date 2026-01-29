import { Body, Controller,Get, Post, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../config/jwt-auth.guard';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard) 
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.storesService.findAll();
  }
}