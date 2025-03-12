import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
} from 'class-validator';

export class ChangeProfileStatusDto {
  @ApiProperty({
    description: 'The status of the user profile',
    example: 'ACTIVE', // Adjust based on your actual enum values
    enum: Status,
  })
  @IsString()
  @IsEnum(Status)
  status: Status;
}

export class CreateAnUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'password123',
  })
  @IsString()
  @Length(6)
  password: string;
}
