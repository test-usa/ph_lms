import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreatePaymentIntentDto, UpdatePaymentStatusDto } from './billing.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  /**
   * Create Payment Intent
   * 
   * Endpoint to create a new payment intent for processing payments.
   * @param createPaymentIntentDto - The data required to create a payment intent.
   * @param req - The request object, which includes the authenticated user.
   * @returns The response containing payment intent information.
   */
  @Post('createPaymentIntent')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @Req() req: Request) {
    return this.billingService.createPaymentIntent({
        payment: createPaymentIntentDto,
        user: req.user, // Assuming user is passed as a request property
    });
  }

  /**
   * Create Checkout Session
   * 
   * Endpoint to create a checkout session for the user.
   * @param createPaymentIntentDto - The data required to initiate the checkout session.
   * @returns The response containing checkout session information.
   */
  @Post('createCheckoutSession')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  createCheckoutSession(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @Req() req: Request) {
    return this.billingService.createCheckoutSession({
      payment: createPaymentIntentDto,
      user: req.user, // Assuming user is passed as a request property
    });
  }

  /**
   * Update Payment Status
   * 
   * Endpoint to update the status of a payment (e.g., success or failure).
   * @param data - The updated payment status data.
   * @returns The response after updating the payment status.
   */
  @Post('updatePaymentStatus')
  updatePaymentStatus(@Body() data: UpdatePaymentStatusDto) {
    return this.billingService.updatePaymentStatus(data);
  }

  /**
   * Success Page
   * 
   * Endpoint to render a success page after a successful payment.
   * @returns A success message page.
   */
  @Get('success')
  successPage() {
    return `<h1>Payment Successful!</h1><p>Your payment has been processed successfully. Thank you for your purchase!</p>`;
  }

  /**
   * Cancel Page
   * 
   * Endpoint to render a cancel page if the payment is not completed.
   * @returns A cancellation message page.
   */
  @Get('cancel')
  cancelPage() {
    return `<h1>Payment Canceled</h1><p>Your payment was not completed. Please try again or contact support.</p>`;
  }

  /**
   * Handles incoming webhook events from Stripe.
   * 
   * - This endpoint listens for webhook events sent by Stripe.
   * - It passes the request to the `handleWebhook` method in the `BillingService`.
   * - The webhook will process events like `payment_intent.succeeded`, `payment_intent.payment_failed`, and `checkout.session.completed`.
   * 
   * @param req - The incoming request from Stripe containing event data.
   * @returns A response indicating the webhook event was received.
   */
  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    return this.billingService.handleWebhook(req);
  }
}
