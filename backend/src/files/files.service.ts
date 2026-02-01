import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'; 
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; 
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private bucketName: string;

  constructor(
    @Inject('MINIO_CONNECTION') private s3Client: S3Client,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME') ?? 'educational-bucket';
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

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return {
      url: url,
      name: fileName,
    };
  }
}