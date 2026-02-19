import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './data-source';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { FilesModule } from './files/files.module';
import { MinioModule } from './minio/minio.module';
import { getRedisConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: getRedisConfig, 
      inject: [ConfigService],
    }),

    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    StoresModule,
    FilesModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}