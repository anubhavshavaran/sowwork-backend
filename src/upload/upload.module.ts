import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule { }
