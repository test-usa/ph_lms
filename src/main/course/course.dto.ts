import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Title of the product',
    example: 'Gaming Laptop',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-performance laptop suitable for gaming and work',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 1299.99 })
  @IsNumber()
  price: number;
}
