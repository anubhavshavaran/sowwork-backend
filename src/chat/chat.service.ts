import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { SocketMessageDto } from './dto';
import { Chat, ChatDocument, ChatRoom, ChatRoomDocument } from './schemas';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  async saveMessage(userId: string, dto: SocketMessageDto) {
    const room = await this.chatRoomModel.findOne({ roomId: dto.roomId });

    if (!room || room.isDeleted) {
      throw new NotFoundException('Chat room not found');
    }

    const newChat = await this.chatModel.create({
      chatRoom: room._id,
      sender: userId,
      message: dto.message,
      document: dto.document,
    });

    return {
      ...newChat.toObject(),
      senderId: userId,
    };
  }

  async getChatRoomMessages(
    userId: Types.ObjectId,
    chatRoomId: string,
    skip: number,
    limit: number,
  ) {
    const messages = await this.chatModel.aggregate([
      {
        $match: {
          chatRoom: new Types.ObjectId(chatRoomId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          sender: [
            {
              $match: {
                sender: userId,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          receiver: [
            {
              $match: {
                sender: {
                  $ne: userId,
                },
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
        },
      },
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return messages[0];
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

  async findChatRoom(filterQuery: FilterQuery<ChatRoom>) {
    return this.chatRoomModel.findOne(filterQuery).exec();
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
