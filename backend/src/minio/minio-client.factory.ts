import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const getMinioClient = (configService: ConfigService) => {
  const minioEndpoint = configService.get('MINIO_ENDPOINT') ?? 'localhost';
  const minioPort = configService.get('MINIO_PORT') ?? '9000';
  const accessKeyId = configService.get('MINIO_ACCESS_KEY') ?? '';
  const secretAccessKey = configService.get('MINIO_SECRET_KEY') ?? '';

  const endpointUrl = `http://${minioEndpoint}:${minioPort}`;

  return new S3Client({
    region: 'us-east-1',
    endpoint: endpointUrl,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
};