import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class CourseService {
    constructor(
        private readonly db:DbService
    ){}

    
}
