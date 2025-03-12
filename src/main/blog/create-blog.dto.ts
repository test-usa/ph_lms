import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog',
    example: 'NestJS Basics',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the blog',
    example: 'This blog explains NestJS concepts.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Author ID (User ID)',
    example: 'user-uuid',
  })
  @IsString()
  authorId: string;

  @ApiProperty({
    description: 'Whether the blog is published',
    example: true,
    required: false,  // Marked as optional in the API
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
