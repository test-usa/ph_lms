import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateInstructorDto {
  @ApiProperty({
    description: 'The profile photo URL of the instructor (optional)',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiProperty({
    description: 'The contact number of the instructor (optional)',
    example: '+1 234 567 890',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    description: 'The address of the instructor (optional)',
    example: '123 Instructor Avenue, City, Country',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'The gender of the instructor (optional)',
    example: 'MALE',
    enum: Gender,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE' })
  gender?: Gender;
}
