import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { S3Service } from 'src/s3/s3.service';
import { AuthenticatedRequest } from 'src/users/dto/token.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('/upload')
  async getUploadUrl(
    @Body('fileName') fileName: string,
    @Body('fileType') fileType: string,
    @Body('fileSize') fileSize: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;

    return this.fileUploadService.generateUrl(
      user.id,
      fileName,
      fileType,
      fileSize,
    );
  }

  @Get('/download/:id')
  async getDownloadUrl(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;

    return this.fileUploadService.downloadFile(id, user.id);
  }

  @Delete('deleteFile/:id')
  async deleteFile(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const user = req.user;

    return await this.fileUploadService.deleteFile(id, user.id);
  }

  @Get('userFiles')
  async getUserFiles(@Req() req: AuthenticatedRequest) {
    const user = req.user;

    return this.fileUploadService.getAllFilesByUser(user.id);
  }
}
