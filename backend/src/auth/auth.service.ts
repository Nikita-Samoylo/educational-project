import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) throw new BadRequestException('User with this email already exists');

    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword, 
      name: dto.name,
      position: dto.position,
    });

    await this.userRepo.save(user);
    return { message: 'Registration successful', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return { 
      token, 
      user: { id: user.id, email: user.email, name: user.name, position: user.position } 
    };
  }
}