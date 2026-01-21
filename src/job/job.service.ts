import { ForbiddenException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';
import { CreateJobRequestDto } from './dto';

@Injectable()
export class JobService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) { }

  async createJobRequest(jobRequest: CreateJobRequestDto) {
    try {
      const user = await this.userService.findUser({ _id: jobRequest.artistId });
      await this.firebaseService.sendNotification(
        "dT7K3zhnQhynMh8ejPYX9v:APA91bFJWgH_WZbWDeLyB5oXHTtZEY1qSKtiNo7-_XMzRMRIXHusl6iPoO9ip93fzhqUJ8GcuX_HWg1HaIq6g6G0T9rq2DZjMxvyBzkg2LpgQlDVtObTmC4",
        "Test",
        "Test"
      );
      return 'Done';
    } catch (error) {
      throw new ForbiddenException('Error creating the job request');
    }
  }
}
