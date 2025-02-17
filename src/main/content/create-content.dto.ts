import { IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

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
