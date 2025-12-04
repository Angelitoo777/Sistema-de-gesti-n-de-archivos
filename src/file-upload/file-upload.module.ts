import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadRepository } from './file-upload.repository';
import { S3Service } from 'src/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    FileUploadRepository,
    S3Service,
    PrismaService,
  ],
})
export class FileUploadModule {}
