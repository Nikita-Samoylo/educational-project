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

  async create(dto: CreateStoreDto, userId: string) {
    const store = this.storeRepository.create({
      ...dto,
      userId,
    });
    return await this.storeRepository.save(store);
  }

  async findAll(userId: string, searchTerm?: string) {
    const stores = await this.storeRepository.find({
      where: { userId: userId }
    });

    return stores
      .filter((store) => {
        const isValidLength = store.name.length > 3;
        const matchesSearch = searchTerm 
          ? store.name.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        return isValidLength && matchesSearch;
      })
      .map((store) => ({
        id: store.id,
        title: store.name.toUpperCase(), 
        address: `г. ${store.location}`, 
        createdAt: new Date(),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }
}