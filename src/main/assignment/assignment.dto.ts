import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty, IsUrl, IsUUID, IsNumber } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'The title of the assignment',
    example: 'Math Homework 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The file associated with the assignment (URL or file path)',
    example: 'https://example.com/uploads/math_homework1.pdf',
  })
  @IsString()
  @IsNotEmpty()
  file: string;

  @ApiProperty({
    description: 'The assured marks assigned to the assignment',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  assuredMark: number;

  @ApiProperty({
    description: 'Whether the assignment has been submitted',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isSubmitted: boolean;

  @ApiProperty({
    description: 'The accrued marks obtained for the assignment',
    example: 85,
  })
  @IsNumber()
  @IsNotEmpty()
  accruedMark: number;

  @ApiProperty({
    description: 'The ID of the student who submitted the assignment (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'The ID of the module to which the assignment belongs (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  @IsNotEmpty()
  moduleId: string;
}
