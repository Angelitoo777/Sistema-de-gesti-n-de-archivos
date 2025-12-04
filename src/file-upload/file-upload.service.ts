import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { S3Service } from 'src/s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly configService: ConfigService,
    private fileUploadRepository: FileUploadRepository,
    private s3Service: S3Service,
  ) {}

  async generateUrl(
    ownerId: string,
    fileName: string,
    mimeType: string,
    fileSize: number,
  ) {
    const { url, s3Key } = await this.s3Service.generatePreSignedUrlForUpload(
      fileName,
      mimeType,
      ownerId,
    );

    const data = {
      owner: ownerId,
      originalName: fileName,
      mimeType,
      size: fileSize,
      s3Key,
      bucketName: this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME'),
    };

    const metadata = await this.fileUploadRepository.generateUrl({
      ...data,
      owner: {
        connect: {
          id: ownerId,
        },
      },
    });

    return { s3Key, url, metadata };
  }

  async downloadFile(fileId: string, ownerId: string): Promise<string> {
    const file = await this.fileUploadRepository.findUrl(fileId);

    if (!file) {
      throw new NotFoundException(`Archivo con ID ${fileId} no encontrado.`);
    }

    if (file.ownerId !== ownerId) {
      throw new NotFoundException(
        `No tienes permiso para acceder al archivo con ID ${fileId}.`,
      );
    }

    const downloadUrl = await this.s3Service.generatePresignedUrlForDowload(
      file.s3Key,
    );
    return downloadUrl;
  }

  async deleteFile(fileId: string, ownerId: string): Promise<object> {
    const file = await this.fileUploadRepository.findUrl(fileId);

    if (!file) {
      throw new NotFoundException(`Archivo con ID ${fileId} no encontrado.`);
    }

    if (file.ownerId !== ownerId) {
      throw new NotFoundException(
        `No tienes permiso para eliminar el archivo con ID ${fileId}.`,
      );
    }

    const s3KeyToDelete = file.s3Key;

    await this.fileUploadRepository.deleteUrl(fileId);

    try {
      await this.s3Service.deleteFile(s3KeyToDelete);
    } catch (error) {
      console.error('Error al eliminar de S3:', error);
    }

    return { message: 'Archivo eliminado correctamente.' };
  }

  async getAllFilesByUser(ownerId: string) {
    return this.fileUploadRepository.getAllFilesByUser(ownerId);
  }
}
