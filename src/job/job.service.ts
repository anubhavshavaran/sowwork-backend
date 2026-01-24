import { ForbiddenException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { CreateJobRequestDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schemas';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { UserDocument } from 'src/user/schemas';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class JobService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    @InjectModel(Job.name) private jobModel: Model<Job>
  ) { }

  async createJobRequest(jobRequest: CreateJobRequestDto) {
    try {
      const artist = await this.userService.findUser({ _id: jobRequest.artistId }, ["-embedding"]);      
      await this.firebaseService.sendNotification(
        artist?.firebaseNotificationToken || '',
        "Job Request",
        "You have a job request"
      );
      this.notificationService.create({
        title: "New Job Request",
        message: "A Customer wants to collaborate with you!",
        user: jobRequest.artistId,
      });
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }

  async updateJob(
    filterQuery: FilterQuery<Job>,
    updateQuery: UpdateQuery<Job>,
  ) {
    try {
      return this.jobModel.updateOne(filterQuery, updateQuery);
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }

  async findJob(
    filterQuery: FilterQuery<Job>,
  ) {
    try {
      return this.jobModel.find(filterQuery);
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }
}
