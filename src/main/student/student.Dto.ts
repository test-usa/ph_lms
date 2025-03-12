import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateStudentDto {
  @ApiProperty({
    description: 'The name of the student (optional)',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The profile photo URL of the student (optional)',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiProperty({
    description: 'The contact number of the student (optional)',
    example: '+1 234 567 890',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    description: 'The address of the student (optional)',
    example: '123 Student Avenue, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'The gender of the student (optional)',
    example: 'MALE',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE' })
  gender?: Gender;
}
