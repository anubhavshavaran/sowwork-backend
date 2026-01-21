import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [FirebaseModule, UserModule, AuthModule],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule { }
