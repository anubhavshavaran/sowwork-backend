import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from '../schemas';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<BookmarkDocument>,
  ) {}

  async toggleBookmark(postId: string, userId: string) {
    const existingBookmark = await this.bookmarkModel.findOne({
      post: postId,
      user: userId,
    });

    if (existingBookmark) {
      await this.bookmarkModel.deleteOne({ _id: existingBookmark._id });
      return { isBookmarked: false };
    } else {
      await this.bookmarkModel.create({
        post: postId,
        user: userId,
      });
      return { isBookmarked: true };
    }
  }

  async getMyBookmarks(userId: string) {
    return this.bookmarkModel
      .find({ user: userId })
      .populate({
        path: 'post',
      })
      .sort({ created_at: -1 })
      .exec();
  }
}
