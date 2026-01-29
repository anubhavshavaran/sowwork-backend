import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/guards';
import { CreatePaymentDto } from './dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('make-payment')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  makePayment(@Body() paymentDto: CreatePaymentDto) {
    return this.paymentService.makePayment(paymentDto);
  }
}
