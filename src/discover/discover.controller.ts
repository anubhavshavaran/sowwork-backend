import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  BookmarkService,
  CommentService,
  LikeService,
  PostService,
} from './services';
import { CreateCommentDto, CreatePostDto } from './dto';
import { AuthGuard } from '../guards';
import { CurrentUser } from '../auth/decorators';
import { type UserDocument } from '../user/schemas';

@Controller('discover')
export class DiscoverController {
  constructor(
    private readonly postService: PostService,
    private readonly bookmarkService: BookmarkService,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

  @Get('post/get-all')
  getAllPosts() {
    return this.postService.findAll();
  }

  @Get('post/get-one/:id')
  getPost(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Get('post/get-my-posts')
  @UseGuards(AuthGuard)
  getMyPost(@CurrentUser() user: UserDocument) {
    return this.postService.findMyPosts(user?._id.toString());
  }

  @Post('post/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() body: CreatePostDto, @CurrentUser() user: UserDocument) {
    return this.postService.create(body, user?._id?.toString());
  }

  @Post('post/delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deletePost(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.postService.delete(id, user?._id?.toString());
  }

  @Post('post/like/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  likePost(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.likeService.toggleLike(id, user?._id?.toString());
  }

  @Post('bookmark/create/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  toggleBookmark(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.bookmarkService.toggleBookmark(id, user?._id?.toString());
  }

  @Get('bookmark/get-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getBookmarks(@CurrentUser() user: UserDocument) {
    return this.bookmarkService.getMyBookmarks(user?._id?.toString());
  }

  @Get('comment/get-all-by-post/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getComments(@Param('id') id: string) {
    return this.commentService.getCommentsByPost(id);
  }

  @Post('comment/create/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentService.addComment(
      id,
      user?._id?.toString(),
      createCommentDto.comment,
    );
  }
}
