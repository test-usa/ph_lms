import { Type } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty, IsDate } from 'class-validator';

export class CreateAssignmentDto {
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  title: string;

  @IsInt({ message: 'Total mark must be an integer.' })
  @IsNotEmpty({ message: 'Total mark is required.' })
  totalMark: number;

  @IsDate({ message: 'Deadline must be a valid date.' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Deadline is required.' })
  deadline: Date;

  @IsString({ message: 'Content ID must be a string.' })
  @IsNotEmpty({ message: 'Content ID is required.' })
  contentId: string;
}

export class SubmitAssignmentDto {
  @IsString({ message: 'Assignment ID must be a string.' })
  @IsNotEmpty({ message: 'Assignment ID is required.' })
  assignmentId: string;

  @IsString({ message: 'Submission must be a string.' })
  @IsNotEmpty({ message: 'Submission is required.' })
  submission: string;
}

export class MarkAssignmentDto {
  @IsString({ message: 'Assignment ID must be a string.' })
  @IsNotEmpty({ message: 'Assignment ID is required.' })
  assignmentId: string;

  @IsString({ message: 'Student ID must be a string.' })
  @IsNotEmpty({ message: 'Student ID is required.' })
  studentId: string;

  @IsInt({ message: 'Acquired mark must be an integer.' })
  @IsNotEmpty({ message: 'Acquired mark is required.' })
  acquiredMark: number;
}
