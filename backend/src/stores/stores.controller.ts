import { Body, Controller, Post, Get, UseGuards, Req, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { storeCookieOptions } from '../config/cookies.config';
import { Request } from 'express';
import { UserFromJwt } from '../config/jwt.strategy'; 

interface RequestWithUser extends Request {
  user: UserFromJwt;
}

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

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
    return this.storesService.findAll(req.user.userId, search);
  }
}