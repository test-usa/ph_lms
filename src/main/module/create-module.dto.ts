import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ description: 'Title of the module', example: 'Introduction to NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Course ID to which the module belongs', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsOptional()
  @IsUUID()
  courseId?: string;
}
