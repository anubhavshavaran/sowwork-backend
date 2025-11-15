import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schemas';
import { CreatePostDto } from '../dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(
    createPostDto: CreatePostDto,
    artistId: string,
  ): Promise<PostDocument | null> {
    return await this.postModel.create({
      ...createPostDto,
      user: artistId,
    });
  }

  async findAll() {
    return this.postModel
      .find({ isDeleted: false })
      .populate('user', 'firstName lastName profileImage')
      .sort({ created_at: -1 })
      .exec();
  }

  async findOne(postId: string) {
    try {
      const post = await this.postModel
        .findOne({ _id: postId, isDeleted: false })
        .populate('user', 'firstName lastName profileImage')
        .exec();

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch {
      throw new NotFoundException('Post not found');
    }
  }

  async findMyPosts(artistId: string) {
    return this.postModel
      .find({ user: artistId, isDeleted: false })
      .sort({ created_at: -1 })
      .exec();
  }

  async delete(postId: string, artistId: string) {
    const post: PostDocument | null = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.toString() !== artistId.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    return null;
  }
}
