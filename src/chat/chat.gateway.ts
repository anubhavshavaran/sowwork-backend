import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../guards';
import { ChatService } from './chat.service';
import { SocketMessageDto } from './dto';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-room')
  @UseGuards(WsAuthGuard)
  async handleJoinRoom(
    @MessageBody() data: SocketMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.findChatRoom({ roomId: data.roomId });
    if (!room || room.isDeleted) {
      client.disconnect();
    }
    await client.join(data.roomId);
  }

  @SubscribeMessage('private-message')
  @UseGuards(WsAuthGuard)
  async handleMessage(
    @MessageBody() data: SocketMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatService.saveMessage(client.data.user._id, data);
    client.to(data.roomId).emit('private-message', chat.message);
  }

  @SubscribeMessage('leave-room')
  @UseGuards(WsAuthGuard)
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ) {
    await client.leave(roomName);
  }
}
