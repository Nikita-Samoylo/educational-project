import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity'; 
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(dto: CreateStoreDto) {
    const store = this.storeRepository.create(dto);
    return await this.storeRepository.save(store);
  }

  async findAll() {
    const stores = await this.storeRepository.find();
    return stores
      .filter((store) => store.name.length > 3)

      .map((store) => ({
        id: store.id,
        title: store.name.toUpperCase(), 
        address: `г. ${store.location}`, 
        createdAt: new Date(),
      }))

      .sort((a, b) => a.title.localeCompare(b.title));
  }
}