import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto';
import { JobService } from 'src/job/job.service';
import { JobStatus } from 'src/common/constants';

@Injectable()
export class PaymentService {
    constructor(
        private readonly jobService: JobService,
        @InjectModel(Payment.name) private paymentModel: Model<Payment>
    ) { }

    async makePayment(paymentDto: CreatePaymentDto) {
        try {
            const job = await this.jobService.findJob({ _id: paymentDto.jobId });
            const payment = await this.paymentModel.create({
                artist: job?.at(0)?.artist,
                customer: job?.at(0)?.customer,
                job: paymentDto.jobId,
                amount: paymentDto.amount,
            });

            await this.jobService.updateJob({ _id: paymentDto.jobId }, { status: JobStatus.ACTIVE });
            
            return payment;
        } catch (error) {
            throw new ForbiddenException('Error making payment');
        }
    }
}
