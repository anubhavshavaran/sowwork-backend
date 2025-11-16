import { Module } from '@nestjs/common';
import { DiscoverController } from './discover.controller';
import {
  BookmarkService,
  CommentService,
  LikeService,
  PostService,
} from './services';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Bookmark,
  BookmarkSchema,
  Comment,
  CommentSchema,
  Like,
  LikeSchema,
  Post,
  PostSchema,
} from './schemas';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Bookmark.name, schema: BookmarkSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [DiscoverController],
  providers: [BookmarkService, PostService, CommentService, LikeService],
})
export class DiscoverModule {}
