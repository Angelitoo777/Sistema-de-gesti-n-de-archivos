import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileUploadRepository {
  constructor(private prisma: PrismaService) {}

  async generateUrl(data: Prisma.FileMetadataCreateInput) {
    return this.prisma.fileMetadata.create({
      data,
    });
  }

  async findUrl(id: string) {
    return this.prisma.fileMetadata.findUnique({
      where: { id },
    });
  }

  async deleteUrl(id: string) {
    return this.prisma.fileMetadata.delete({
      where: { id },
    });
  }

  async getAllFilesByUser(ownerId: string) {
    return this.prisma.fileMetadata.findMany({
      where: { ownerId },
    });
  }
}
