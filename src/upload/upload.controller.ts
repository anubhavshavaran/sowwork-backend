import { Body, Controller, FileTypeValidator, HttpCode, HttpStatus, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards';
import { UploadImageDto } from './dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('image')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadIMage(
    @Body() body: UploadImageDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadImage(body.folder, file);
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  }
}
