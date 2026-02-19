import { Body, Controller, Post, Get, UseGuards, Req, Query, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { Request } from 'express';
import { UserFromJwt } from '../config/jwt.strategy'; 

interface RequestWithUser extends Request {
  user: UserFromJwt;
}

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    @Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateStoreDto,
    @Req() req: RequestWithUser,
  ) {
    const store = await this.storesService.create(dto, req.user.userId);
    
    return store;
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Req() req: RequestWithUser,
    @Query('search') search?: string
  ) {
    const cacheKey = `stores_${req.user.userId}_${search || 'all'}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const stores = await this.storesService.findAll(req.user.userId, search);
    await this.cacheManager.set(cacheKey, stores, 60000);

    return stores;
  }
}