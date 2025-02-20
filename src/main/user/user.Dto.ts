import { Status } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class ChangeProfileStatusDto {
    @IsString()
    @IsEnum(Status)
    status: Status;
}
