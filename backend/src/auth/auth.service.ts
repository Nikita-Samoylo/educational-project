import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const ужеЕсть = await this.userRepo.findOne({ where: { email: data.email } });
    if (ужеЕсть) throw new BadRequestException('Этот email уже занят');

    const user = this.userRepo.create({
      email: data.email,
      password: data.password,   
      name: data.name,
      position: data.position,
    });

    await this.userRepo.save(user);
    return { message: 'Успешно зарегистрирован!', userId: user.id };
  }

  async login(data: any) {
    const user = await this.userRepo.findOne({ where: { email: data.email } });

    if (!user || user.password !== data.password) {
      throw new BadRequestException('Неверный email или пароль');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name, position: user.position }
    };
  }
}