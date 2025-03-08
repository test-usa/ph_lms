import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

// login
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString() @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  password: string;
}

// Register
export class RegisterDto {
  @IsString() @MinLength(3, {
    message: 'Name is too short. Minimum length is 3 characters.',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString() @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  password: string;

  @IsOptional() @IsString() @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ChangePasswordDto {
  @IsString() @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  oldPassword: string;

  @IsString() @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters.',
  })
  newPassword: string;
}
