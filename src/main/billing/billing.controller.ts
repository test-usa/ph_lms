import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreatePaymentIntentDto, UpdatePaymentStatusDto } from './billing.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('createPaymentIntent')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @Req() req:Request) {
    return this.billingService.createPaymentIntent({
        payment: createPaymentIntentDto,
        user: req.user, // Assuming user is passed as a request property
    });
  }

  @Post('createCheckoutSession')
  createCheckoutSession(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    return this.billingService.createCheckoutSession(createPaymentIntentDto);
  }

  @Post('updatePaymentStatus')
  updatePaymentStatus(@Body() data: UpdatePaymentStatusDto) {
    return this.billingService.updatePaymentStatus(data);
  }


  @Get('success')
  successPage() {
    return `<h1>Payment Successful!</h1><p>Your payment has been processed successfully. Thank you for your purchase!</p>`;
  }

  // Endpoint to render the Cancel page
  @Get('cancel')
  cancelPage() {
    return `<h1>Payment Canceled</h1><p>Your payment was not completed. Please try again or contact support.</p>`;
  }
}
