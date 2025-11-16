import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { SocketMessageDto } from './dto';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../guards';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    console.log(client.id, 'disconnected');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  afterInit() {
    console.log('init');
  }

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
    client.disconnect();
  }
}
