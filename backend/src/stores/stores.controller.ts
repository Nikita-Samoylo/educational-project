import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import type { Response } from 'express';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateStoreDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const store = await this.storesService.create(dto);

    res.cookie('current_store', store.id, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return {message: 'Store created'};
  }
}