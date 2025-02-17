import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Title of the module',
    example: 'Introduction to NestJS',
    minLength: 3,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Course ID to which the module belongs. This is optional.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;
}
