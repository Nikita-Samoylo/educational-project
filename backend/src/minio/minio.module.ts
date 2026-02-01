import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMinioClient } from './minio-client.factory';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MINIO_CONNECTION',
      useFactory: getMinioClient,
      inject: [ConfigService],
    },
  ],
  exports: ['MINIO_CONNECTION'],
})
export class MinioModule {}