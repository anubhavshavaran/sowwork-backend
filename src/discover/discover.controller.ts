import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService, PostService } from './services';
import { CreatePostDto } from './dto';
import { AuthGuard } from '../guards';
import { type Request } from 'express';

@Controller('discover')
export class DiscoverController {
  constructor(
    private readonly postService: PostService,
    private readonly bookmarkService: BookmarkService,
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
  getMyPost(@Req() req: Request) {
    return this.postService.findMyPosts(req['user']?._id);
  }

  @Post('post/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() body: CreatePostDto, @Req() req: Request) {
    return this.postService.create(body, req['user']?._id);
  }

  @Post('post/delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deletePost(@Param('id') id: string, @Req() req: Request) {
    return this.postService.delete(id, req['user']?._id);
  }

  @Post('bookmark/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  toggleBookmark(@Param('id') id: string, @Req() req: Request) {
    return this.bookmarkService.toggleBookmark(id, req['user']?._id);
  }

  @Get('bookmark')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getBookmarks(@Req() req: Request) {
    return this.bookmarkService.getMyBookmarks(req['user']?._id);
  }
}
