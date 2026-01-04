import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { PostRequestFilterDto } from 'src/common/dto';

@Controller('discover')
export class DiscoverController {
  constructor(
    private readonly postService: PostService,
    private readonly bookmarkService: BookmarkService,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) { }

  @Post('post/get-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getAllPosts(
    @CurrentUser() user: UserDocument,
    @Body() postRequestFilterDto: PostRequestFilterDto
  ) {
    return this.postService.findAll(
      user?._id,
      postRequestFilterDto.skip,
      postRequestFilterDto.limit
    );
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

  @Post('post/delete')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deletePost(@Query('id') id: string, @CurrentUser() user: UserDocument) {
    return this.postService.delete(id, user?._id?.toString());
  }

  @Post('post/like')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  likePost(@Query('id') id: string, @CurrentUser() user: UserDocument) {
    return this.likeService.toggleLike(id, user?._id?.toString());
  }

  @Post('bookmark/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  toggleBookmark(@Query('id') id: string, @CurrentUser() user: UserDocument) {
    return this.bookmarkService.toggleBookmark(id, user?._id?.toString());
  }

  @Get('bookmark/get-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getBookmarks(@CurrentUser() user: UserDocument) {
    return this.bookmarkService.getMyBookmarks(user?._id?.toString());
  }

  @Get('comment/get-all-by-post')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getComments(@Query('id') id: string) {
    return this.commentService.getCommentsByPost(id);
  }

  @Post('comment/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  addComment(
    @Query('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentService.addComment(
      id,
      user?._id?.toString(),
      createCommentDto.comment,
    );
  }

  @Post('report-post')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  report(
    @Query('id') id: string,
    @CurrentUser() user: UserDocument,
  ) {
    console.log(`Post with id ${id} has been successfully reported the user ${user?._id}`);

    return true;
  }
}
