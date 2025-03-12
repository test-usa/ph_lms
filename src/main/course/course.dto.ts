import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The title of the course',
    example: 'Introduction to NestJS',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The price of the course',
    example: 99.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The thumbnail image URL of the course',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsString()
  thumbnail: string;
}

export class UpdateCourseDto {
  @ApiProperty({
    description: 'The title of the course (optional)',
    example: 'Advanced NestJS Concepts',
    required: false,
  })
  @IsOptional() 
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The price of the course (optional)',
    example: 79.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'The thumbnail image URL of the course (optional)',
    example: 'https://example.com/updated-thumbnail.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}

export class AddInstructorToCourseDto {
  @ApiProperty({
    description: 'The UUID of the instructor being added to the course',
    example: 'b76a2e4e-d7ed-4c7f-b3d3-cf9ec9a5bb6e',
  })
  @IsUUID()
  instructorId: string;
}
