import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: 'Title of the course', example: 'NestJS for Beginners' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed course description', example: 'This course covers NestJS basics and advanced topics.' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Price of the course', example: 99.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Whether the course is published', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
