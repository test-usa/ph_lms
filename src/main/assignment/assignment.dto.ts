import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty, IsUrl, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
 

  @ApiProperty({
    description: 'The file associated with the assignment (URL or file path)',
    example: 'https://example.com/uploads/math_homework1.pdf',
  })
  @IsString()
  file?: string;



  @ApiProperty({
    description: 'Whether the assignment has been submitted',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isSubmitted: boolean;

  @ApiProperty({
    description: 'The accrued marks obtained for the assignment',
    example: 85,
  })
  @IsNumber()
  @IsOptional()
  accruedMark: number;

  @ApiProperty({
    description: 'The ID of the student who submitted the assignment (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  studentId: string;


  @ApiProperty({
    description: 'The ID of the assignment instance related to this assignment (UUID v4)',
    example: '98fe4671-52d3-42e7-bc66-5b34b9b3a8de',
  })
  @IsUUID('4')
  @IsOptional()
  assignmentInstanceId?: string;
}
