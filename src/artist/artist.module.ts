import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Category, CategorySchema, Specialization, SpecializationSchema } from './schemas';
import { User, UserSchema } from 'src/user/schemas';
import { ArtistService, CategoryService } from './services';
import { ArtistController, SearchController } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: Specialization.name, schema: SpecializationSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserModule,
    AuthModule,
  ],
  controllers: [ArtistController, SearchController],
  providers: [ArtistService, CategoryService],
  exports: [ArtistService],
})
export class ArtistModule { }
