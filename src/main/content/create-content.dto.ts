import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assignment?: string;

  @IsUUID()
  moduleId: string;
}
