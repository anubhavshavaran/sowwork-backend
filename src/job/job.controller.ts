import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthGuard } from 'src/guards';
import { CreateJobRequestDto, JobDetailsDto } from './dto';
import { type UserDocument } from 'src/user/schemas';
import { CurrentUser } from 'src/auth/decorators';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Get('get-job-request-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getJobRquest(@Query('jobRequestId') jobRequestId: string) {
    return this.jobService.findJobRequest({ _id: jobRequestId });
  }

  @Post('create-job-request')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  requestJob(@Body() jobRequest: CreateJobRequestDto) {
    return this.jobService.createJobRequest(jobRequest);
  }

  @Post('accept-job-request')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  acceptJobRequest(@Body() jobRequest: CreateJobRequestDto) {
    return "accepted";
  }

  @Post('add-details')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  addDetails(@Query('jobid') jobId: string, @Body() job: JobDetailsDto) {
    return this.jobService.updateJob({ _id: jobId }, job);
  }

  @Get('get-all-jobs')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getJobs(@CurrentUser() user: UserDocument) {
    return this.jobService.findJob({
      $or: [
        { artist: user._id },
        { customer: user._id }
      ]
    });
  }
}
