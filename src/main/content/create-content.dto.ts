import { ContentType } from '@prisma/client';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import the ApiProperty decorator

export class CreateContentDto {
  @ApiProperty({
    description: 'The title of the content',
    example: 'Introduction to NestJS',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Video URL associated with the content',
    example: 'https://www.example.com/video.mp4',
    required: false,  // Optional property
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({
    description: 'Description of the content',
    example: 'This is a tutorial for learning NestJS.',
    required: false,  // Optional property
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The type of content (e.g., article, video, etc.)',
    example: 'ARTICLE',
  })
  @IsString()
  contentType: ContentType;

  @ApiProperty({
    description: 'The unique identifier for the module associated with this content',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  moduleId: string;
}


export class UpdateContentDto {
  @ApiProperty({
    description: 'The title of the content (optional)',
    example: 'Updated NestJS Introduction',
    required: false,  // Optional property
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Video URL associated with the content (optional)',
    example: 'https://www.example.com/updated-video.mp4',
    required: false,  // Optional property
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({
    description: 'Description of the content (optional)',
    example: 'This is an updated tutorial for learning NestJS.',
    required: false,  // Optional property
  })
  @IsOptional()
  @IsString()
  description?: string;
}
