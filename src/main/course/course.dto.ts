import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;
}

export class UpdateCourseDto {
  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsNumber()
  price?: number;
}

export class AddInstructorToCourseDto {
  @IsUUID()
  instructorId: string;
}
