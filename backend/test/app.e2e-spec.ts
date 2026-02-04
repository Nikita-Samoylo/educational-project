import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { StoresService } from './../src/stores/stores.service';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';

describe('StoresController (e2e)', () => {
  let app: INestApplication;
  
  const mockStoresService = {
    findAll: jest.fn().mockReturnValue([
      { id: '1', title: 'TEST SHOP', address: 'г. Test' }
    ]),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StoresService) 
      .useValue(mockStoresService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) 
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/stores/all (GET)', () => {
    return request(app.getHttpServer())
      .get('/stores/all')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].title).toBe('TEST SHOP');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});