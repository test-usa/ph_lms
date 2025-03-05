import { Status } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
} from 'class-validator';

export class ChangeProfileStatusDto {
  @IsString() @IsEnum(Status)
  status: Status;
}

export class CreateAnUserDto {
  @IsString() @Length(2, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsString() @Length(6)
  password: string;
}
