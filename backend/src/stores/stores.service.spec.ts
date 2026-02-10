import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from '../entities/store.entity';

const mockStoresFromDb = [
  { id: '1', name: 'Al', location: 'Moscow' },         
  { id: '2', name: 'Zara', location: 'London' },       
  { id: '3', name: 'Apple', location: 'New York' },    
];

const mockStoreRepository = {
  find: jest.fn().mockResolvedValue(mockStoresFromDb),
  create: jest.fn(),
  save: jest.fn(),
};

describe('StoresService', () => {
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
      ],
    }).compile();
    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should filter, map and sort stores correctly', async () => {
    const result = await service.findAll();

    expect(result).toHaveLength(2);

    expect(result[0].title).toBe('APPLE');
    expect(result[1].title).toBe('ZARA');

    expect(result[0].address).toBe('г. New York');
  });
});