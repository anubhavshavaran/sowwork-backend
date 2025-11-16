import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../guards';
import { CurrentUser } from '../auth/decorators';
import type { UserDocument } from '../user/schemas';
import { PostRequestFilterDto } from '../common/dto';
import { CreateChatRoomDto } from './dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('room/get-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getChatRooms(
    @CurrentUser() user: UserDocument,
    @Body() postRequestFilterDto: PostRequestFilterDto,
  ) {
    return this.chatService.getUserChatRooms(
      user?._id,
      postRequestFilterDto.skip,
      postRequestFilterDto.limit,
    );
  }

  @Post('message/get-all/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getChatRoomMessages(
    @Param('id') roomId: string,
    @Body() postRequestFilterDto: PostRequestFilterDto,
    @CurrentUser() user: UserDocument,
  ) {
    const chatRoom = await this.chatService.findChatRoom({ _id: roomId });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const messages = await this.chatService.getChatRoomMessages(
      user?._id,
      roomId,
      postRequestFilterDto.skip,
      postRequestFilterDto.limit,
    );

    return {
      chatRoom,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      messages,
    };
  }

  @Post('room/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatService.createChatRoom(
      createChatRoomDto.customerId,
      createChatRoomDto.artistId,
    );
  }

  @Post('room/delete/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.GONE)
  deleteChatRoom(@Param('id') roomId: string) {
    return this.chatService.deleteChatRoom(roomId);
  }
}
