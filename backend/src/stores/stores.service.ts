import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Raw, And } from 'typeorm';
import { Store } from '../entities/store.entity'; 
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(dto: CreateStoreDto, userId: string) {
    const store = this.storeRepository.create({
      ...dto,
      userId,
    });
    return await this.storeRepository.save(store);
  }

  async findAll(userId: string, searchTerm?: string) {
    const lengthCondition = Raw((alias) => `LENGTH(${alias}) > 3`);

    const nameCondition = searchTerm 
      ? And(lengthCondition, ILike(`%${searchTerm}%`))
      : lengthCondition; 

    const stores = await this.storeRepository.find({
      where: {
        userId: userId, 
        name: nameCondition, 
      },
      order: {
        name: 'ASC', 
      },
    });

    return stores.map((store) => ({
      id: store.id,
      title: store.name.toUpperCase(), 
      address: `г. ${store.location}`, 
      createdAt: new Date(),
    }));
  }
}