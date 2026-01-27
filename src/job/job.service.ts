import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { CreateJobRequestDto } from './dto';
import { Job, JobRequest } from './schemas';
import { NotificationType } from 'src/common/constants';

@Injectable()
export class JobService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(JobRequest.name) private jobRequestModel: Model<JobRequest>
  ) { }

  async createJobRequest(jobRequestDto: CreateJobRequestDto) {
    try {
      const artist = await this.userService.findUser({ _id: jobRequestDto.artistId }, ["-embedding"]);
      const customer = await this.userService.findUser({ _id: jobRequestDto.customerId }, ["-embedding"]);

      const expires = new Date(new Date().getTime() + 60 * 1000).getTime();
      const newJobRequest = await this.jobRequestModel.create({
        artist: jobRequestDto.artistId,
        customer: jobRequestDto.customerId,
        date: jobRequestDto.date,
        durationInHours: jobRequestDto.durationInHours,
        expiresAt: expires
      });

      await this.firebaseService.sendNotification(
        artist?.firebaseNotificationToken || '',
        "New Job Request",
        `${customer?.firstName} ${customer?.lastName} wants to collaborate with you!`
      );
      this.notificationService.create({
        title: "New Job Request",
        message: `${customer?.firstName} ${customer?.lastName} wants to collaborate with you!`,
        user: jobRequestDto.artistId,
        type: NotificationType.JOB_REQUEST,
        jobRequest: newJobRequest._id.toString()
      });

      return newJobRequest;
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }

  async acceptJobRequest(id: string) {
    try {
      const jobRequest = await this.jobRequestModel.findById(id).populate('artist customer');
      const { customer, artist, durationInHours, date, expiresAt, isDeleted, amount }: any = jobRequest;
      
      const now = new Date().getTime();
      if (jobRequest && (expiresAt > now || isDeleted)) {
        return {
          status: false,
          message: "Job request expired"
        }
      }

      if (jobRequest) {
        await this.firebaseService.sendNotification(
          customer?.firebaseNotificationToken || '',
          "Job Request Accepted",
          `${artist?.firstName} ${artist?.lastName} is ready to collaborate with you!`
        );
        this.notificationService.create({
          title: "Job Request Accepted",
          message: `${artist?.firstName} ${artist?.lastName} is ready to collaborate with you!`,
          user: customer?._id,
          type: NotificationType.JOB_REQUEST,
        });

        const job = await this.jobModel.create({
          artist: artist?._id,
          customer: customer?._id,
          date,
          durationInHours,
          amount
        });

        return job;
      }

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

  async findJobRequest(
    filterQuery: FilterQuery<JobRequest>,
  ) {
    try {
      return this.jobRequestModel.find(filterQuery);
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }
}
