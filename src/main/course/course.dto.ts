import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID } from 'class-validator';

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

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
   @ApiProperty({
      description: 'Unique identifier (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID('4', { message: 'ID must be a valid UUID (version 4).' })
    id: string;
}
