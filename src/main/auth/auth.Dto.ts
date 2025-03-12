import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

// Login
export class LoginDto {
  @ApiProperty({
    description: 'The email address used for login',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password used for login',
    example: 'password123',
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  password: string;
}

// Register
export class RegisterDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3, {
    message: 'Name is too short. Minimum length is 3 characters.',
  })
  name: string;

  @ApiProperty({
    description: 'The email address used for registration',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password used for registration',
    example: 'password123',
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  password: string;

  @ApiProperty({
    description: 'The phone number of the user (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;
}

// Refresh Token
export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token used to obtain a new access token',
    example: 'refresh_token_example',
  })
  @IsString()
  refreshToken: string;
}

// Forgot Password
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'The email address used to reset the password',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

// Change Password
export class ChangePasswordDto {
  @ApiProperty({
    description: 'The old password of the user',
    example: 'password123',
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  oldPassword: string;

  @ApiProperty({
    description: 'The new password of the user',
    example: 'newpassword456',
  })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  newPassword: string;
}
