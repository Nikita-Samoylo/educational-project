import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME') ?? 'educational-bucket';

    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: `http://${this.configService.get('MINIO_ENDPOINT') ?? 'localhost'}:${this.configService.get('MINIO_PORT') ?? '9000'}`,
      credentials: {
        accessKeyId: this.configService.get('MINIO_ACCESS_KEY') ?? '',
        secretAccessKey: this.configService.get('MINIO_SECRET_KEY') ?? '',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      url: `http://${this.configService.get('MINIO_ENDPOINT') ?? 'localhost'}:${this.configService.get('MINIO_PORT') ?? '9000'}/${this.bucketName}/${fileName}`,
      name: fileName,
    };
  }
}