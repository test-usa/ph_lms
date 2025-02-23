import { ApiProperty } from '@nestjs/swagger';
import { Status, UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class ChangeProfileStatusDto {
  @IsString()
  @IsEnum(Status)
  status: Status;
}

export class CreateAnUserDto {
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
  @ApiProperty({
    description: 'Role of the user',
    example: 'INSTRUCTOR',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class updateAnUserDto {
  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
  })
  @IsString()
  @IsOptional()
  @Length(6)
  password: string;
  @ApiProperty({
    description: 'Role of the user',
    example: 'INSTRUCTOR',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @ApiProperty({
    description: 'Name of the user',
    example: 'Daniel Haque',
  })
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty({
    description: 'Phone number of the user',
    example: '01333333333',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone: string;
}
