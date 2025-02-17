/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  password: string;
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}

// Refresh Token
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

// Change Password
export class ChangePasswordDto {
  @IsString()
  @MinLength(6, {
    message: 'Old password is too short. Minimum length is 6 characters.',
  })
  oldPassword: string;
  @IsString()
  @MinLength(6, {
    message: 'New password is too short. Minimum length is 6 characters.',
  })
  newPassword: string;
}

// Forgot Password
export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
