import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly uploadExpiration: number;
  private readonly downloadExpiration: number;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    this.uploadExpiration = this.configService.getOrThrow<number>(
      'AWS_S3_UPLOAD_EXPIRATION_SECONDS',
    );

    this.downloadExpiration = this.configService.getOrThrow<number>(
      'AWS_S3_DOWNLOAD_EXPIRATION_SECONDS',
    );

    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async generatePreSignedUrlForUpload(
    fileName: string,
    fileType: string,
    userId: string,
  ): Promise<{ url: string; s3Key: string }> {
    const fileExtension = fileName.split('.').pop();
    const timestamp = Date.now();

    const s3Key = `user-${userId}/uploads/${timestamp}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.uploadExpiration,
    });

    return { url, s3Key };
  }

  generatePresignedUrlForDowload(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
    });

    const url = getSignedUrl(this.s3Client, command, {
      expiresIn: this.downloadExpiration,
    });

    return url;
  }

  async deleteFile(s3Key: string): Promise<string> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      }),
    );

    return 'Archivo eliminado correctamente';
  }
}
