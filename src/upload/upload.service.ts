import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class UploadService implements OnModuleInit {
  onModuleInit() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(folder: string, file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No file provided');

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
