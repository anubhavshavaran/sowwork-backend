import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas';
import { Model, Types } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private notifModel: Model<Notification>) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const notitifcation = await this.notifModel.create(createNotificationDto);
    return notitifcation;
  }

  async findByUser(userId: Types.ObjectId) {
    const notifications = await this.notifModel.find({ user: userId });
    return notifications;
  }

  async markAsSeen(userId: string) {
    const notifications = await this.notifModel.updateMany({ user: userId }, { $set: { seen: true } });
    return notifications;
  }
}
