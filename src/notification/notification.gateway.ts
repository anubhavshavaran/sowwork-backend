import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/guards';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsAuthGuard)
  async handleConnection(client: Socket) {
    const { userId } = client.handshake.query;

    if (!userId) {
      client.disconnect();
      return;
    }

    const roomName = `notification_channel_${userId}`;
    await client.join(roomName);
  }

  notifyUser(userId: string, payload: any) {
    this.server.to(`notification_channel_${userId}`).emit('notifications', payload);
  }
}
