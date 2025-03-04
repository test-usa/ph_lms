
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsString()
  thumbnail: string
}

export class UpdateCourseDto {
  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsNumber()
  price?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string
}

export class AddInstructorToCourseDto {
  @IsUUID()
  instructorId: string;
}
