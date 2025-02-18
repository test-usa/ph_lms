import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    // const token = this.extractTokenFromHeader(request);

    if (!token) throw new HttpException('Token Not Provided', 401);

    try {
      const payload = this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
