import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, MinLength, ArrayMinSize } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({
    description: 'The question text',
    minLength: 4,
    example: 'What is the capital of France?'
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
    example: ['Paris', 'London', 'Berlin', 'Madrid']
  })
  @IsArray()
  @ArrayMinSize(4, {
    message: 'Options array is too short. Minimum size is 4 elements.',
  })
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    description: 'Index of the correct answer in the options array',
    example: 0,
    minimum: 0
  })
  @IsInt({
    message: 'Correct answer index must be a valid integer.',
  })
  correctAnswer: number;
}