import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreatePaymentIntentDto } from './billing.dto';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService:BillingService){}

    @Post('createPaymentIntent')
    createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto){
        return this.billingService.createPaymentIntent(createPaymentIntentDto);
    }

    @Post('createCheckoutSession')
    createCheckoutSession(@Body() createPaymentIntentDto: CreatePaymentIntentDto){
        return this.billingService.createCheckoutSession(createPaymentIntentDto);
    }
}