/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbService } from 'src/db/db.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/utils/sendMail';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  // imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService, MailerService],
})
export class AuthModule {}
