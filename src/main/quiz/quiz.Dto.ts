import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, MinLength, ArrayMinSize, Min, Max, IsUUID, ValidateNested } from 'class-validator';
import { PartialType } from "@nestjs/mapped-types";
import { Type } from 'class-transformer';

export class CreateQuizDto {
  @ApiProperty({
    description: 'The ID of the module this quiz belongs to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Module ID must be a valid UUID (version 4).' })
  contentId: string;

  @ApiProperty({
    description: 'The question text',
    minLength: 4,
    example: 'What is the capital of France?',
  })
  @IsString()
  @MinLength(4, {
    message: 'Question is too short. Minimum length is 4 characters.',
  })
  question: string;

  @ApiProperty({
    description: 'Array of possible answers',
    type: [String],
    minItems: 4,
    example: ['Paris', 'London', 'Berlin', 'Madrid'],
  })
  @IsArray()
  @ArrayMinSize(4, {
    message: 'Options array is too short. Minimum size is 4 elements.',
  })
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    description: 'Index of the correct answer (1 to 4)',
    example: 1,
    minimum: 1,
    maximum: 4,
  })
  @IsInt({ message: 'Correct answer index must be a valid integer.' })
  @Min(1, { message: 'Correct answer index must be at least 1.' })
  @Max(4, { message: 'Correct answer index cannot be greater than 4.' })
  correctAnswer: number;
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {
  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'ID must be a valid UUID (version 4).' })
  id: string;
}

class AnswerSheetItem {
  @ApiProperty({
    description: 'Quiz ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Quiz ID must be a valid UUID (version 4).' })
  quizId: string;

  @ApiProperty({
    description: 'Selected answer (must be between 1 and 4)',
    example: 2,
    minimum: 1,
    maximum: 4,
  })
  @IsInt({ message: 'Answer must be an integer.' })
  @Min(1, { message: 'Answer must be at least 1.' })
  @Max(4, { message: 'Answer cannot be greater than 4.' })
  answer: number;
}

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'List of quiz answers',
    type: [AnswerSheetItem], // Swagger array type
  })
  @IsArray({ message: 'Answer sheet must be an array.' })
  @ValidateNested({ each: true }) // Validate each object in array
  @Type(() => AnswerSheetItem) // Enable class transformation
  answerSheet: AnswerSheetItem[];

  @ApiProperty({
    description: 'Quiz Instance ID (UUID)',
    example: 'e29b5500-41d4-4a71-a716-446655440000',
  })
  @IsUUID('4', { message: 'Quiz Instance ID must be a valid UUID (version 4).' })
  quizInstanceId: string;
}