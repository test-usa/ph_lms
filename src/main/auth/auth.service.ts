/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  HttpException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Status, UserRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { RegisterDto } from './auth.Dto';
import { MailerService } from 'src/utils/sendMail';
import { TUser } from 'src/interface/token.type';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) { }

  // Login
  public async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.db.user.findUnique({
      where: { email, status: Status.ACTIVE },
    });

    if (!user) throw new HttpException('User not found', 401);

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new HttpException('Invalid credentials', 401);

    const payload = { email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // Register
  async registerUser(registerDto: RegisterDto, user: TUser) {
    const { email, password, role, phone, name } = registerDto;

    if (role === UserRole.SUPER_ADMIN)
      throw new ForbiddenException('Creating Super Admin is not allowed');
    if ((role === UserRole.ADMIN || role === UserRole.INSTRUCTOR) && !user)
      throw new ForbiddenException('You are not authorized to register admin / instructor');
    if (role === UserRole.ADMIN && user && user.role !== 'SUPER_ADMIN')
      throw new ForbiddenException('Creating Admin is not allowed except for Super Admin');
    if (role === UserRole.INSTRUCTOR && user && (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN'))
      throw new ForbiddenException('Creating Admin is not allowed for Student');    

    const existingUser = await this.db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await this.db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || UserRole.STUDENT,
        status: Status.ACTIVE,
        phone,
        name
      },
    });
    return {
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      message: 'Registration successful',
    };
  }

  // Refresh Token
  async refreshToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const user = await this.db.user.findUniqueOrThrow({
      where: { email: payload.email, status: Status.ACTIVE, },
    });
    const accessToken = this.jwtService.sign(
      { email: user.email, role: user.role },
      { secret: this.configService.get('JWT_ACCESS_SECRET') },
    );
    return { accessToken };
  }

  // Forgot
  async forgotPassword(email: string) {
    const user = await this.db.user.findUniqueOrThrow({
      where: { email, status: Status.ACTIVE },
    });
    const token = this.jwtService.sign(
      { email: user.email, role: user.role },
      { secret: this.configService.get('JWT_RESET_SECRET') },
    );
    const resetPassLink = `${this.configService.get('RESET_PASS_LINK')}?userId=${user.id}&token=${token}`;
    await this.mailerService.sendMail(
      user.email,
      `<div>
          <p>Dear User,</p>
          <p>Click on this Button to reset your password. Link expires in 10 minutes.</p> 
          <p>
              <a href="${resetPassLink}">
                  <button>
                      Reset Password
                  </button>
              </a>
          </p>
      </div>`,
    );
  }
}
