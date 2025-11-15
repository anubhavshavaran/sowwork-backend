import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument, Post, PostDocument } from '../schemas';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async toggleLike(postId: string, userId: string) {
    const existingLike = await this.likeModel.findOne({
      post: postId,
      user: userId,
    });

    if (existingLike) {
      await this.likeModel.deleteOne({ _id: existingLike._id });
      await this.postModel.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
      });
      return { isLiked: false };
    } else {
      await this.likeModel.create({ post: postId, user: userId });
      await this.postModel.findByIdAndUpdate(postId, {
        $inc: { likesCount: 1 },
      });
      return { isLiked: true };
    }
  }
}
