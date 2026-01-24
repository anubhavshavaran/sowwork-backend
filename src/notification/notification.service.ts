import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/createNotification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas';
import { Model, Types } from 'mongoose';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notifModel: Model<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.notifModel.create(createNotificationDto);
      this.notificationGateway.notifyUser(createNotificationDto.user, notification);
      return notification;
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
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
