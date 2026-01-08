import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Specialization, SpecializationSchema } from './schemas/specialization.schema';
import { SearchController } from './search.controller';
import { User, UserSchema } from 'src/user/schemas';

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
