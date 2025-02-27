import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty, IsUrl, IsUUID } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'The title of the assignment',
    example: 'Math Homework 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The ID of the module to which the assignment belongs (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  moduleId: string;

}
