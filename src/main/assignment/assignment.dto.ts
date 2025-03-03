import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a new assignment.
 */
export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Title of the assignment',
    example: 'Math Homework',
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @ApiProperty({
    description: 'Total marks for the assignment',
    example: 100,
  })
  @IsInt({ message: 'Total mark must be an integer.' })
  @IsNotEmpty({ message: 'Total mark is required.' })
  totalMark: number;

  @ApiProperty({
    description: 'Content ID (UUID) to which the assignment belongs',
    example: '9078a187-443d-481e-961c-189c92c41c45',
  })
  @IsString({ message: 'Content ID must be a string.' })
  @IsNotEmpty({ message: 'Content ID is required.' })
  contentId: string;
}

/**
 * DTO for the response when a student starts an assignment.
 */
export class StartAssignmentResponseDto {
  @ApiProperty({
    description: 'ID of the assignment',
    example: 'd3ace945-41b9-4e2a-807f-34c4f58e200f',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the assignment',
    example: 'Math Homework',
  })
  title: string;

  @ApiProperty({
    description: 'Total marks for the assignment',
    example: 100,
  })
  totalMark: number;

  @ApiProperty({
    description: 'Content ID associated with the assignment',
    example: '9078a187-443d-481e-961c-189c92c41c45',
  })
  contentId: string;

  @ApiProperty({
    description: 'Description of the content',
    example: 'This assignment covers basic algebra.',
  })
  contentDescription: string;

  @ApiProperty({
    description: 'Video URL associated with the content (optional)',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  video?: string;
}

/**
 * DTO for submitting an assignment by a student.
 */
export class SubmitAssignmentDto {
  @ApiProperty({
    description: 'Assignment ID (UUID) to which the submission belongs',
    example: 'd3ace945-41b9-4e2a-807f-34c4f58e200f',
  })
  @IsString({ message: 'Assignment ID must be a string.' })
  @IsNotEmpty({ message: 'Assignment ID is required.' })
  assignmentId: string;

  @ApiProperty({
    description: 'Submission file or text',
    example: 'https://example.com/assignment.pdf',
  })
  @IsString({ message: 'Submission must be a string.' })
  @IsNotEmpty({ message: 'Submission is required.' })
  submission: string;
}

/**
 * DTO for the response when a student submits an assignment.
 */
export class AssignmentSubmissionResponseDto {
  @ApiProperty({
    description: 'ID of the assignment submission',
    example: 'a1b2c3d4-e5f6-4a71-a716-123456789012',
  })
  id: string;

  @ApiProperty({
    description: 'Submission file or text',
    example: 'https://example.com/assignment.pdf',
  })
  submission: string;

  @ApiProperty({
    description: 'Marks acquired by the student (default: 0)',
    example: 0,
  })
  acquiredMark: number;

  @ApiProperty({
    description: 'Whether the assignment has been submitted',
    example: true,
  })
  isSubmitted: boolean;

  @ApiProperty({
    description: 'Whether the assignment has been reviewed',
    example: false,
  })
  isReviewed: boolean;

  @ApiProperty({
    description: 'Assignment ID (UUID) to which the submission belongs',
    example: 'd3ace945-41b9-4e2a-807f-34c4f58e200f',
  })
  assignmentId: string;

  @ApiProperty({
    description: 'Student ID (UUID) who submitted the assignment',
    example: 'bedf7ad7-17e4-499f-aac2-c0e9d4148361',
  })
  studentId: string;

  @ApiProperty({
    description: 'Timestamp when the submission was created',
    example: '2025-03-02T03:07:34.657Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Timestamp when the submission was last updated',
    example: '2025-03-02T03:07:34.657Z',
  })
  updatedAt: string;
}