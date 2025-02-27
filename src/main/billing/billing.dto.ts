import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({
    example: 'usd',
    description: 'Currency in which the payment is made',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Array of unique identifiers (UUIDs)',
    example: ['550e8400-e29b-41d4-a716-446655440000', 'c56a4180-65aa-42ec-a945-5fd21dec0538'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one course ID must be provided.' })
  @ArrayUnique({ message: 'Course IDs must be unique.' })
  @IsUUID('4', { each: true, message: 'Each course ID must be a valid UUID (version 4).' })
  courseIds: string[];
}


export class UpdatePaymentStatusDto {
  @ApiProperty({
    description: 'The Payment Intent ID from Stripe',
    example: 'pi_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty({ message: 'Payment Intent Key is required' })
  intendKey: string;
}
