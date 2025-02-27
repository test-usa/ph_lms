import { Body, Controller, Post, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreatePaymentIntentDto } from './billing.dto';
import { Request } from 'express';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Post('createPaymentIntent')
    createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
        return this.billingService.createPaymentIntent(createPaymentIntentDto);
    }

    @Post('createCheckoutSession')
    createCheckoutSession(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
        return this.billingService.createCheckoutSession(createPaymentIntentDto);
    }

    // ✅ Webhook for Stripe Events
    @Post('webhook')
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') sig: string,
    ) {
        console.log('🔹 Webhook Headers:', req.headers);
        return this.billingService.handleWebhook(req, sig);
    }
}
