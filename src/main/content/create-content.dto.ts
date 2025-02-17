import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    description: 'Title of the content',
    example: 'Introduction to JavaScript',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Video URL related to the content',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({
    description: 'Description of the content',
    example: 'This is a brief introduction to JavaScript.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Assignment related to the content',
    example: 'Solve 5 JavaScript exercises',
  })
  @IsOptional()
  @IsString()
  assignment?: string;

  @ApiProperty({
    description: 'Module ID to which this content belongs',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  moduleId: string;
}
