import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema, JobRequest, JobRequestSchema } from './schemas';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JobRequest.name, schema: JobRequestSchema }]),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    FirebaseModule,
    UserModule,
    AuthModule,
    NotificationModule,
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService]
})
export class JobModule { }
