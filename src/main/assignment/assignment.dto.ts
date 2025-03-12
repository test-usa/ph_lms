import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty, IsDate } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'The title of the assignment',
    example: 'Introduction to NestJS',
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @ApiProperty({
    description: 'The total mark for the assignment',
    example: 100,
  })
  @IsInt({ message: 'Total mark must be an integer.' })
  @IsNotEmpty({ message: 'Total mark is required.' })
  totalMark: number;

  @ApiProperty({
    description: 'The deadline for the assignment submission',
    example: '2025-05-01T12:00:00Z',
  })
  @IsDate({ message: 'Deadline must be a valid date.' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Deadline is required.' })
  deadline: Date;

  @ApiProperty({
    description: 'The ID of the content the assignment is related to',
    example: 'content-uuid',
  })
  @IsString({ message: 'Content ID must be a string.' })
  @IsNotEmpty({ message: 'Content ID is required.' })
  contentId: string;
}

export class SubmitAssignmentDto {
  @ApiProperty({
    description: 'The unique identifier for the assignment being submitted',
    example: 'assignment-uuid',
  })
  @IsString({ message: 'Assignment ID must be a string.' })
  @IsNotEmpty({ message: 'Assignment ID is required.' })
  assignmentId: string;

  @ApiProperty({
    description: 'The content of the assignment submission',
    example: 'Here is my solution for the assignment.',
  })
  @IsString({ message: 'Submission must be a string.' })
  @IsNotEmpty({ message: 'Submission is required.' })
  submission: string;
}

export class MarkAssignmentDto {
  @ApiProperty({
    description: 'The unique identifier for the assignment being graded',
    example: 'assignment-uuid',
  })
  @IsString({ message: 'Assignment ID must be a string.' })
  @IsNotEmpty({ message: 'Assignment ID is required.' })
  assignmentId: string;

  @ApiProperty({
    description: 'The unique identifier for the student submitting the assignment',
    example: 'student-uuid',
  })
  @IsString({ message: 'Student ID must be a string.' })
  @IsNotEmpty({ message: 'Student ID is required.' })
  studentId: string;

  @ApiProperty({
    description: 'The acquired mark for the assignment submission',
    example: 85,
  })
  @IsInt({ message: 'Acquired mark must be an integer.' })
  @IsNotEmpty({ message: 'Acquired mark is required.' })
  acquiredMark: number;
}
