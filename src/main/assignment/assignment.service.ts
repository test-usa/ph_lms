import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAssignmentDto } from './assignment.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Assignment } from '@prisma/client';

@Injectable()
export class AssignmentService {
    constructor(
        private readonly db: DbService
    ) { }

}
