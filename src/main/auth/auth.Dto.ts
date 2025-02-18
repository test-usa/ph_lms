/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// login
export class LoginDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  password: string;
}

// Register
export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token for authentication',
    example: 'some-refresh-token',
  })
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email to reset password',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
