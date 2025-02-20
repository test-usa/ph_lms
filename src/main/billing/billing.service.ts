import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class BillingService {
    constructor(private readonly db:DbService){}
}
