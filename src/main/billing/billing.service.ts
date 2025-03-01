import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './billing.dto';
import { Request, response } from 'express';



@Injectable()
export class BillingService {
    private stripe: Stripe;

    constructor(
        private readonly db: DbService,
        private readonly configService: ConfigService,
    ) {
        this.stripe = new Stripe(this.configService.getOrThrow<string>("STRIPE_SECRET_KEY"), {
            apiVersion: '2023-10-16' as any,
        });
    }

    // ✅ Create Payment Intent (For Direct Payments)
    async createPaymentIntent({ amount, currency }: CreatePaymentIntentDto) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount * 100, // Convert to cents
                currency,
                payment_method_types: ['card'],
            });

            return { clientSecret: paymentIntent.client_secret };
        } catch (error) {
            console.error('❌ Error creating Payment Intent:', error.message);
            throw new Error('Failed to create payment intent.');
        }
    }

    // ✅ Create Checkout Session
    async createCheckoutSession({ amount, currency, studentId, courseId }: CreatePaymentIntentDto) {
        try {
            const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
    
            // Validate required metadata before creating the session
            if (!studentId || !courseId) {
                throw new Error('❌ Missing studentId or courseId.');
            }
    
            console.log('🛠️ Creating Checkout Session with:', { amount, currency, studentId, courseId });
    
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency,
                            product_data: { name: 'Course Payment' },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${clientUrl}/cancel`,
                metadata: { studentId: studentId.toString(), courseId: courseId.toString() }, // Ensure metadata is string
            });
    
            console.log('✅ Checkout Session created:', session.id);
            return { url: session.url };
        } catch (error) {
            console.error('❌ Error creating checkout session:', error);
            throw new Error('Failed to create checkout session.');
        }
    }
    

    // ✅ Handle Stripe Webhook for Payment Confirmation

    
    async handleWebhook(req: Request, sig: string) {
        const endpointSecret = this.configService.getOrThrow<string>("STRIPE_WEBHOOK_SECRET");
    
        if (!req.body || !sig) {
            console.error('❌ Webhook request is missing body or signature.');
            return { error: 'Invalid webhook request' };
        }
    
        let event: Stripe.Event;
    
        try {
            event = this.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("✅ Event Received:", event);
    
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object as Stripe.Checkout.Session;
    
                    console.log(`✅ Checkout Session completed: ${session.id}`);
    
                    const studentId = session.metadata?.studentId;
                    const courseId = session.metadata?.courseId;
    
                    if (!studentId || !courseId) {
                        console.error('❌ Missing studentId or courseId in metadata');
                        return { error: 'Missing studentId or courseId' };
                    }
    
                    // ✅ Save Payment to Database
                    await this.db.payment.create({
                        data: {
                            stripeChargeId: session.id,
                            amount: session.amount_total ? session.amount_total / 100 : 0,
                            status: session.payment_status,
                            studentId,
                            courseId,
                        },
                    });
    
                    console.log('💾 Payment saved to database.');
                    break;
                }
    
                case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.log(`💰 Payment Intent Succeeded: ${paymentIntent.id}`);
                    break;
                }
    
                case 'payment_intent.payment_failed': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent;
                    console.error(`❌ Payment Intent Failed: ${paymentIntent.id}`);
                    break;
                }
    
                default:
                    console.warn(`⚠️ Unhandled event type: ${event.type}`);
            }
    
            return { received: true };
        } catch (err) {
            console.error('⚠️ Webhook signature verification failed:', err.message);
            return { error: 'Webhook signature verification failed' };
        }
    }
    
}
