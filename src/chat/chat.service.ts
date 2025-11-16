import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SocketMessageDto } from './dto/socketMessage.dto';
import { Chat, ChatDocument, ChatRoom, ChatRoomDocument } from './schemas';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  async saveMessage(userId: string, dto: SocketMessageDto) {
    const room = await this.chatRoomModel.findById(dto.roomId);

    if (!room) {
      throw new NotFoundException('Chat room not found');
    }

    if (room.isDeleted) {
      throw new ForbiddenException('This chat room is deleted');
    }

    const uid = new Types.ObjectId(userId);
    const isArtist = room.artist.equals(uid);
    const isCustomer = room.customer.equals(uid);

    if (!isArtist && !isCustomer) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    const newChat = await this.chatModel.create({
      chatRoom: room._id,
      artist: room.artist,
      customer: room.customer,
      message: dto.message,
      document: dto.document,
    });

    return {
      ...newChat.toObject(),
      senderId: userId,
    };
  }

  async getChatRoomMessages(chatRoomId: string, skip: number, limit: number) {
    return this.chatModel
      .find({
        chatRoom: new Types.ObjectId(chatRoomId),
      })
      .skip(skip)
      .limit(limit);
  }

  async createChatRoom(customerId: string, artistId: string) {
    const chatRoom = await this.chatRoomModel.findOne({
      artist: new Types.ObjectId(artistId),
      customer: new Types.ObjectId(customerId),
    });

    if (chatRoom) {
      return chatRoom;
    } else {
      return await this.chatRoomModel.create({
        artist: new Types.ObjectId(artistId),
        customer: new Types.ObjectId(customerId),
      });
    }
  }

  async deleteChatRoom(chatRoomId: string) {
    return this.chatRoomModel.updateOne(
      { _id: chatRoomId },
      { isDeleted: true },
    );
  }

  async getUserChatRooms(userId: Types.ObjectId, skip: number, limit: number) {
    return this.chatRoomModel
      .find({
        $or: [{ artist: userId }, { customer: userId }],
        isDeleted: false,
      })
      .skip(skip)
      .limit(limit);
  }
}
