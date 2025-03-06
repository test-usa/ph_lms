import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class UpdateStudentDto {
  @ApiProperty({ description: 'Profile photo URL', example: 'https://example.com/photo.jpg', required: false })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiProperty({ description: 'Contact information', example: 'email@example.com', required: false })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({ description: 'Address', example: '123 Main St, City, Country', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Gender', enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE' })
  gender?: Gender;
}
