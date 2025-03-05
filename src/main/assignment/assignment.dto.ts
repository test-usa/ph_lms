import { IsString, IsInt, IsNotEmpty, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @IsInt({ message: 'Total mark must be an integer.' })
  @IsNotEmpty({ message: 'Total mark is required.' })
  totalMark: number;

  @IsString({ message: 'Content ID must be a string.' })
  @IsNotEmpty({ message: 'Content ID is required.' })
  contentId: string;
}

export class StartAssignmentResponseDto {
  @IsString({ message: 'ID must be a string.' })
  id: string;

  @IsString({ message: 'Title must be a string.' })
  title: string;

  @IsInt({ message: 'Total mark must be an integer.' })
  totalMark: number;

  @IsString({ message: 'Content ID must be a string.' })
  contentId: string;

  @IsString({ message: 'Content description must be a string.' })
  contentDescription: string;

  @IsOptional()
  @IsString({ message: 'Video must be a string.' })
  video?: string;
}

export class SubmitAssignmentDto {
  @IsString({ message: 'Assignment ID must be a string.' })
  @IsNotEmpty({ message: 'Assignment ID is required.' })
  assignmentId: string;

  @IsString({ message: 'Submission must be a string.' })
  @IsNotEmpty({ message: 'Submission is required.' })
  submission: string;
}

export class AssignmentSubmissionResponseDto {
  @IsString({ message: 'ID must be a string.' })
  id: string;

  @IsString({ message: 'Submission must be a string.' })
  submission: string;

  @IsInt({ message: 'Acquired mark must be an integer.' })
  acquiredMark: number;

  @IsBoolean({ message: 'Is submitted must be a boolean.' })
  isSubmitted: boolean;

  @IsBoolean({ message: 'Is reviewed must be a boolean.' })
  isReviewed: boolean;

  @IsString({ message: 'Assignment ID must be a string.' })
  assignmentId: string;

  @IsString({ message: 'Student ID must be a string.' })
  studentId: string;
}
