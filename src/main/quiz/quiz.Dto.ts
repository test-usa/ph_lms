import { IsArray, IsInt, MinLength, ArrayMinSize, Min, Max, IsUUID, ValidateNested, IsNumber, IsString } from 'class-validator';
import { PartialType } from "@nestjs/mapped-types";
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';  // Import the ApiProperty decorator

export class SingleQuizDto {

  @ApiProperty({
    description: 'The question in the quiz',
    example: 'What is NestJS?',
  })
  @IsString({ message: 'Question must be a string' })
  @MinLength(4, {
    message: 'Question is too short. Minimum length is 4 characters.',
  })
  question: string;

  @ApiProperty({
    description: 'List of options for the quiz',
    example: ['A Node.js framework', 'A front-end library', 'A CSS tool', 'A database management system'],
    isArray: true,
  })
  @IsArray({ message: 'Options must be an array' })
  @ArrayMinSize(4, {
    message: 'Options array must contain at least 4 elements.',
  })
  @IsString({ each: true, message: 'Each option must be a string' })
  options: string[];

  @ApiProperty({
    description: 'The correct answer index (1-4)',
    example: 1,
  })
  @IsInt({ message: 'Correct answer index must be a valid integer.' })
  @Min(1, { message: 'Correct answer index must be at least 1.' })
  @Max(4, { message: 'Correct answer index cannot be greater than 4.' })
  correctAnswer: number;
}

export class CreateQuizDto {

  @ApiProperty({
    description: 'The unique identifier for the content this quiz belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Content ID must be a valid UUID (version 4).' })
  contentId: string;

  @ApiProperty({
    description: 'The total marks for this quiz',
    example: 20,
  })
  @IsNumber({}, { message: 'Total mark must be a number' })
  totalMark: number;

  @ApiProperty({
    description: 'List of quizzes data',
    type: [SingleQuizDto],  // Specify that the property is an array of SingleQuizDto objects
  })
  @IsArray({ message: 'Quizzes must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SingleQuizDto) // Required for class-transformer
  quizesData: SingleQuizDto[];
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {

  @ApiProperty({
    description: 'The unique identifier for the quiz to be updated',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'ID must be a valid UUID (version 4).' })
  id: string;
}

export class AnswerSheetItem {

  @ApiProperty({
    description: 'The unique identifier for the quiz this answer is for',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Quiz ID must be a valid UUID (version 4).' })
  quizId: string;

  @ApiProperty({
    description: 'The selected answer index (1-4)',
    example: 1,
  })
  @IsInt({ message: 'Answer must be an integer.' })
  answer: number;
}

export class SubmitAnswerDto {

  @ApiProperty({
    description: 'The list of answers submitted for the quiz',
    type: [AnswerSheetItem],
  })
  @IsArray({ message: 'Answer sheet must be an array.' })
  @ValidateNested({ each: true })
  @Type(() => AnswerSheetItem)
  answerSheet: AnswerSheetItem[];

  @ApiProperty({
    description: 'The unique identifier for the content the answers belong to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Content ID must be a valid UUID (version 4).' })
  contentId: string;
}
