import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { NotificationService } from './notification.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly notificationService: NotificationService) {}

  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');

  async handleConnection(client: Socket) {
    const { userId } = client.handshake.query;

    // if (!userId) {
    //   this.logger.warn(`Socket ${client.id} connected without userId. Disconnecting...`);
    //   client.disconnect();
    //   return;
    // }

    const roomName = `user_${userId}`;
    await client.join(roomName);

    this.logger.log(`User ${userId} (Socket: ${client.id}) joined room: ${roomName}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket ${client.id} disconnected`);
  }

  notifyUser(userId: number, payload: any) {
    this.server.to(`user_${userId}`).emit('notification', payload);
  }
}
