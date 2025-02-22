import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminProfileDto {
  @ApiProperty({
    description: 'The first name of the admin',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the admin',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'The email of the admin',
    example: 'admin@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The password of the admin',
    example: 'newpassword123',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;
}
