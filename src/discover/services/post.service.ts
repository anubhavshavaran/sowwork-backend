import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../schemas';
import { CreatePostDto } from '../dto';
import { Status } from 'src/common/constants';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) { }

  async create(
    createPostDto: CreatePostDto,
    artistId: string,
  ): Promise<PostDocument | null> {
    return await this.postModel.create({
      ...createPostDto,
      user: artistId,
    });
  }

  async findAll(userId: Types.ObjectId, skip: number, limit: number) {
    return await this.postModel.aggregate([
      {
        $match: {
          isDeleted: false,
          postOnFeed: true,
          status: Status.STATUS_ACTIVE,
        },
      },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, profileImage: 1 } }
          ],
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'likes',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$post', '$$postId'] },
                    { $eq: ['$user', userId] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'userLikeData',
        },
      },
      {
        $addFields: {
          isLiked: { $gt: [{ $size: '$userLikeData' }, 0] },
        },
      },
      {
        $lookup: {
          from: 'bookmarks',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$post', '$$postId'] },
                    { $eq: ['$user', userId] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'userBookmarkData',
        },
      },
      {
        $addFields: {
          isBookmarked: { $gt: [{ $size: '$userBookmarkData' }, 0] },
        },
      },
      {
        $project: {
          userLikeData: 0,
          userBookmarkData: 0,
        },
      },
    ]);
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
