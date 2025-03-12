import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto, UpdatePaymentStatusDto } from './billing.dto';
import { TUser } from 'src/interface/token.type';
import { Request } from 'express';

@Injectable()
export class BillingService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(
    private readonly db: DbService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-02-24.acacia',
      },
    );
    this.webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
  }

  private async allCourse(courseIds: string[]) {
    const courses = await this.db.course.findMany({
      where: { id: { in: courseIds } },
    });
    if (courses.length !== courseIds.length) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    const totalPrice = courses.reduce((prev, curr) => prev + curr.price, 0);
    return { courses, totalPrice };
  }

  private async IsUserExist(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: { student: true },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createPaymentIntent({
    payment,
    user,
  }: {
    payment: CreatePaymentIntentDto;
    user: TUser;
  }) {
    const { currency, courseIds } = payment;
    const course = await this.allCourse(courseIds);
    const userExists = await this.IsUserExist(user.id);
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: course.totalPrice * 100, // Convert to cents
        currency,
        payment_method_types: ['card'],
      });

      await this.db.payment.create({
        data: {
          amount: course.totalPrice,
          intendKey: paymentIntent.id,
          student: {
            connect: { id: userExists.student?.id },
          },
          course: {
            connect: courseIds.map((id) => ({ id })),
          },
          status: 'PENDING',
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createCheckoutSession({
    payment,
    user,
  }: {
    payment: CreatePaymentIntentDto;
    user: TUser;
  }) {
    const course = await this.allCourse(payment.courseIds);
    const userExists = await this.IsUserExist(user.id);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: payment.email,
      line_items: [
        {
          price_data: {
            currency: payment.currency,
            product_data: { name: 'Sample Product' },
            unit_amount: course.totalPrice * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/billing/success',
      cancel_url: 'http://localhost:3000/billing/cancel',
    });

    await this.db.payment.create({
      data: {
        amount: course.totalPrice,
        course: {
          connect: payment.courseIds.map((id) => ({ id })),
        },
        status: 'PENDING',
        student: {
          connectOrCreate: {
            where: {
              email: userExists.email,
            },
            create: {
              email: userExists.email,
              name: userExists.name,
              userId: userExists.id,
            },
          },
        },
      },
    });

    return { url: session.url };
  }

  async updatePaymentStatus({ intendKey }: UpdatePaymentStatusDto) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(intendKey);
    return paymentIntent;
  }

  /**
   * Handles incoming Stripe webhook events.
   * Verifies the request and processes relevant events.
   */
  async handleWebhook(req: Request) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        this.webhookSecret,
      );
    } catch (err) {
      throw new HttpException(
        `Webhook Error: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerEmail =
          paymentIntent.receipt_email || paymentIntent.metadata?.email;
        const intentKey = paymentIntent.id; // Use paymentIntent.id as the intentKey

        // Update payment status and save both email and intentKey
        if (customerEmail) {
          await this.db.$transaction(async (ctx) => {
            const student = await ctx.student.findUnique({
              where:{
                email: customerEmail,
              }
            })

            await ctx.payment.update({
              where:{
                studentId: student?.id
              },
              data:{
                status: 'SUCCESS',
                intendKey: intentKey, // Save the intentKey
              }
            })
          })
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerEmail =
          paymentIntent.receipt_email || paymentIntent.metadata?.email;
        const intentKey = paymentIntent.id; // Use paymentIntent.id as the intentKey

        // Update payment status and save both email and intentKey
        if (customerEmail) {
          await this.db.$transaction(async (ctx) => {
            const student = await ctx.student.findUnique({
              where:{
                email: customerEmail,
              }
            })

            await ctx.payment.update({
              where:{
                studentId: student?.id
              },
              data:{
                status: 'FAILED',
                intendKey: intentKey, // Save the intentKey
              }
            })
          })
        }

        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail =
          session.customer_email || session.customer_details?.email;
        const intentKey = session.payment_intent?.toString(); // Use payment_intent as the intentKey

        // Update payment status and save both email and intentKey
        if (session.payment_intent && customerEmail) {
          await this.db.$transaction(async (ctx) => {
            const student = await ctx.student.findUnique({
              where:{
                email: customerEmail,
              }
            })

            await ctx.payment.update({
              where:{
                studentId: student?.id
              },
              data:{
                status: 'SUCCESS',
                intendKey: intentKey, // Save the intentKey
              }
            })
          })
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}
