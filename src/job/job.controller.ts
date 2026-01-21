import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthGuard } from 'src/guards';
import { CreateJobRequestDto } from './dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post('create-job-request')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  requestForJob(@Body() jobRequest: CreateJobRequestDto) {
    return this.jobService.createJobRequest(jobRequest)
  }
}
