import { IsString, IsNumber, IsUUID, IsBoolean, IsOptional } from 'class-validator';

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

// export class PublishOrUnpublishCourseDto {
//   @ApiProperty({
//     description: 'The unique identifier of the course',
//     example: '550e8400-e29b-41d4-a716-446655440000',
//   })
//   @IsUUID('4', { message: 'courseId must be a valid UUID v4' })
//   courseId: string;

//   @ApiProperty({
//     description: 'Indicates whether the course should be published or unpublished',
//     example: true,
//   })
//   @IsBoolean({ message: 'isPublished must be a boolean' })
//   isPublished: boolean;
// }

