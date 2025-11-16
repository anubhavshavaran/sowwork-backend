export class SocketMessageDto {
  roomId: string;
  message?: string;
  document?: {
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    url: string;
  };
}
