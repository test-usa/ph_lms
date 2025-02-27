import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto, UpdatePaymentStatusDto } from './billing.dto';
import { TUser } from 'src/interface/token.type';

@Injectable()
export class BillingService {
  private stripe: Stripe;
  constructor(
    private readonly db: DbService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-01-27.acacia',
      },
    );
  }

  /**
   * Retrieves all courses by given course IDs and calculates the total price.
   * Throws an error if any course is not found.
   */
  private async allCourse(courseIds: string[]) {
    const courses = await this.db.course.findMany({
      where: { 
        id: { in: courseIds },
      },
    });
    if (courses.length !== courseIds.length) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const totalPrice = courses.reduce((prev, curr) => prev + curr.price, 0);
    return {
      courses,
      totalPrice
    };
  }

  /**
   * Checks if a user exists by user ID.
   * Throws an error if the user is not found.
   */
  private async IsUserExist(userId: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include : { student: true }
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  /**
   * Creates a Stripe Payment Intent for the given user and courses.
   * Stores the payment record in the database.
   */
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
        amount: course.totalPrice,
        currency,
        payment_method_types: ['card'],
      });
      console.log(paymentIntent);
      
      await this.db.payment.create({
        data: {
          amount: course.totalPrice,
          intendKey: paymentIntent.id,
          student: {
            connect: {
              id: userExists.student?.id,
            },
          },
          course:{
            connect: courseIds.map(id => ({ id })),
          },
          status: "PENDING",
        },
      });
      return { clientSecret: paymentIntent.client_secret, id: paymentIntent.id };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Creates a Stripe Checkout Session for purchasing courses.
   * Returns the session URL for redirection.
   */
  async createCheckoutSession({ courseIds, currency }: CreatePaymentIntentDto) {
    const course = await this.allCourse(courseIds);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Sample Product',
            },
            unit_amount: course.totalPrice * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/billing/success',
      cancel_url: 'http://localhost:3000/billign/cancel',
    });

    return { url: session.url };
  }

  /**
   * Retrieves the payment status from Stripe using the intent key.
   */
  async updatePaymentStatus({
    intendKey
  }: UpdatePaymentStatusDto) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(intendKey);
    return paymentIntent;
  }
}
