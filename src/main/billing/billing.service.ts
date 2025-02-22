import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './billing.dto';

@Injectable()
export class BillingService {
    private stripe: Stripe;
    constructor(
        private readonly db:DbService,
        private readonly configService: ConfigService,
    ){
        this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-01-27.acacia',
          });
    }

    async createPaymentIntent({
        amount,
        currency
    }:CreatePaymentIntentDto) {
        try {
          const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
          });
    
          return { clientSecret: paymentIntent.client_secret };
        } catch (error) {
          throw new Error(error.message);
        }
      }
}
