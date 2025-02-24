import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,  private db: DbService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException('Token Not Provided', 401);
    }
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: new ConfigService().getOrThrow('JWT_SECRET'),
      });
      const { email } = decoded;
      
      const user = await this.db.user.findUnique({ where: { email: email } });
    
      if (!user) {
        throw new HttpException('User not found!', 404);
      }
      if (user?.status === "DELETED") {
        throw new HttpException('User is deleted!', 403);
      }
      if (user?.status === 'BLOCKED') {
        throw new HttpException('User is blocked!', 403);
      }
      request['user'] = decoded;
    } catch (error) {
      throw new HttpException('Token Not Provided', 401);
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
