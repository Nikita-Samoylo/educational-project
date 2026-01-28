import { Body, Controller, Post, Res } from '@nestjs/common';
import express from 'express'; 
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const { token, user } = await this.authService.login(dto);

    res.cookie('access_token', token, {
      httpOnly: true, 
      secure: false,  
      sameSite: 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return { user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token'); 
    return { message: 'Logged out successfully' };
  }
}