import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
interface IUser {
    email: string
    role: string
    iat: number
}

@Injectable()
export class UserService {
    constructor(private db: DbService) { }

    async getUser(user:IUser ) {
        const result = await this.db.user.findUniqueOrThrow({
            where: { email: user.email }
        });
        return result;
    }
}