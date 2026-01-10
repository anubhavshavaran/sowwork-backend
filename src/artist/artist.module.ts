import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { Category, CategorySchema, Specialization, SpecializationSchema } from './schemas';
import { Deliverable, DeliverableSchema, Faq, FaqSchema, User, UserSchema } from 'src/user/schemas';
import { ArtistService, CategoryService, SearchService } from './services';
import { ArtistController, SearchController } from './controllers';
import { DiscoverModule } from 'src/discover/discover.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: Specialization.name, schema: SpecializationSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }]),
    MongooseModule.forFeature([{ name: Deliverable.name, schema: DeliverableSchema }]),
    UserModule,
    AuthModule,
    DiscoverModule,
  ],
  controllers: [ArtistController, SearchController],
  providers: [ArtistService, CategoryService, SearchService],
  exports: [ArtistService],
})
export class ArtistModule { }
