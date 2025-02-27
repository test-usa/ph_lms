import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
} from 'class-validator';

export class ChangeProfileStatusDto {
  @IsString()
  @IsEnum(Status)
  status: Status;
}

export class CreateAnUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'instructor1@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
  })
  @IsString()
  @Length(6)
  password: string;
}
