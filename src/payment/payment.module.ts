import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    FirebaseModule,
    UserModule,
    AuthModule,
    NotificationModule,
    JobModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
