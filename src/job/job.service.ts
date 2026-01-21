import { ForbiddenException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { CreateJobRequestDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schemas';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { UserDocument } from 'src/user/schemas';

@Injectable()
export class JobService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    @InjectModel(Job.name) private jobModel: Model<Job>
  ) { }

  async createJobRequest(jobRequest: CreateJobRequestDto) {
    try {
      const artist = await this.userService.findUser({ _id: jobRequest.artistId });
      await this.firebaseService.sendNotification(
        artist?.firebaseNotificationToken || '',
        "Job Request",
        "You have a job request"
      );
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }

  async mockJob(customer: UserDocument, jobRequest: CreateJobRequestDto) {
    try {
      const artist = await this.userService.findUser({ _id: jobRequest.artistId });
      const job = await this.jobModel.create({
        artist: artist?._id,
        customer: customer._id,
        date: jobRequest.date,
        durationInHours: jobRequest.durationInHours,
        amount: Number(artist?.perHourRate) * Number(jobRequest.durationInHours),
      });

      return job;
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }
  
  async updateJob(
    filterQuery: FilterQuery<Job>,
    updateQuery: UpdateQuery<Job>,
  ) {
    try {
      console.log(filterQuery);
      
      return this.jobModel.updateOne(filterQuery, updateQuery);
    } catch (error) {
      console.log(error);
      
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
