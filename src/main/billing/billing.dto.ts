import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 1000, description: 'Payment amount in cents (e.g., $10 = 1000)' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'usd', description: 'Currency in which the payment is made' })
  @IsString()
  currency: string;
}
