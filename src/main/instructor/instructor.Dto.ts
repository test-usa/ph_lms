import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateInstructorDto {
  @IsOptional() @IsString()
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional() @IsString()
  address?: string;

  @IsOptional() @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE' })
  gender?: Gender;
}
