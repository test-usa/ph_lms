import {
  IsArray,
  IsString,
  MinLength,
  ArrayMinSize,
  IsInt,
} from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @MinLength(4, {
    message: 'Question is too short. Minimum length is 4 characters.',
  })
  question: string;

  @IsArray()
  @ArrayMinSize(4, {
    message: 'Options array is too short. Minimum size is 4 elements.',
  })
  @IsString({ each: true }) // Ensures all items in the array are strings
  options: string[];

  @IsInt({
    message: 'Correct answer index must be a valid integer.',
  })
  correctAnswer: number;
}
