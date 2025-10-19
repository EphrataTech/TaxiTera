import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-intent')
  async createPaymentIntent(@Body() { amount }: { amount: number }) {
    return this.paymentsService.createPaymentIntent(amount);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('confirm')
  async confirmPayment(@Body() { paymentIntentId }: { paymentIntentId: string }) {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }
}