import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument, Post, PostDocument } from '../schemas';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async addComment(
    postId: string,
    userId: string,
    text: string,
  ): Promise<CommentDocument> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const newComment = await this.commentModel.create({
      post: postId,
      user: userId,
      comment: text,
    });

    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    return newComment;
  }

  async getCommentsByPost(postId: string) {
    return this.commentModel
      .find({ post: postId, is_deleted: false })
      .populate('user', 'firstName lastName profileImage')
      .sort({ created_at: -1 })
      .exec();
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findOne({
      _id: commentId,
      user: userId,
    });
    if (!comment)
      throw new NotFoundException('Comment not found or unauthorized');

    await this.commentModel.deleteOne({ _id: commentId });

    await this.postModel.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    return { success: true };
  }
}
