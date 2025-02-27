import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 1000, description: 'Payment amount in cents (e.g., $10 = 1000)' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'usd', description: 'Currency in which the payment is made' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'course_123', description: 'ID of the course being purchased' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 'student_456', description: 'ID of the student making the payment' })
  @IsString()
  studentId: string;
}

export class StripeWebhookDto {
  @ApiProperty({ example: 'evt_12345', description: 'Stripe event ID' })
  @IsString()
  eventId: string;

  @ApiProperty({ example: 'payment_intent.succeeded', description: 'Type of Stripe event' })
  @IsString()
  eventType: string;

  @ApiProperty({ example: 'pi_67890', description: 'Stripe payment intent ID' })
  @IsString()
  stripePaymentIntentId: string;

  @ApiProperty({ example: 1000, description: 'Payment amount in cents' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'usd', description: 'Currency of the payment' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'succeeded', description: 'Payment status' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'course_123', description: 'ID of the course purchased' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 'student_456', description: 'ID of the student who made the payment' })
  @IsString()
  studentId: string;
}
