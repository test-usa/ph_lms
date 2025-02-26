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
      async createCheckoutSession({
        amount,
        currency,
      }:CreatePaymentIntentDto) {
        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency,
                product_data: {
                  name: 'Sample Product',
                },
                unit_amount: amount * 100, // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/cancel',
        });
    
        return { url: session.url };
      }
}
