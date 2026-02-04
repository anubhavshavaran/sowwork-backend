import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { Address, AddressSchema, User, UserSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    JwtModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
