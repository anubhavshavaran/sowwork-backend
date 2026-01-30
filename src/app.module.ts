import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ArtistModule } from './artist/artist.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DiscoverModule } from './discover/discover.module';
import { ChatModule } from './chat/chat.module';
import { AddressModule } from './address/address.module';
import { JobModule } from './job/job.module';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        dbName: configService.get<string>('DATABASE_NAME'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.info('connected'));
          connection.on('open', () => console.info('open'));
          connection.on('disconnected', () => console.info('disconnected'));
          connection.on('reconnected', () => console.info('reconnected'));
          connection.on('disconnecting', () => console.info('disconnecting'));

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ArtistModule,
    UserModule,
    AuthModule,
    DiscoverModule,
    ChatModule,
    AddressModule,
    JobModule,
    UserModule,
    FirebaseModule,
    NotificationModule,
    PaymentModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
