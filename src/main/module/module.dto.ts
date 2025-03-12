import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import the ApiProperty decorator

export class CreateModuleDto {
  @ApiProperty({
    description: 'The title of the module',
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The unique identifier for the course associated with this module (optional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,  // Optional property
  })
  @IsUUID()
  courseId?: string;
}
