/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  HttpException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Status, UserRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { LoginDto, RegisterDto } from './auth.Dto';
import { MailerService } from 'src/utils/sendMail';
import { TUser } from 'src/interface/token.type';
import { ApiResponse } from 'src/utils/sendResponse';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  // Login
  public async loginUser(data: LoginDto): Promise<
    ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
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
      statusCode: 200,
      success: true,
      message: 'Logged in successfully',
      data: { accessToken, refreshToken },
    };
  }

  // Register
  async registerUser(
    registerDto: RegisterDto,
    user: TUser,
  ): Promise<
    ApiResponse<{
      email: string;
      role: string;
      phone: string | null;
    }>
  > {
    const { email, password, role, phone, name } = registerDto;

    if (role === UserRole.SUPER_ADMIN)
      throw new HttpException('Creating Super Admin is not allowed', HttpStatus.FORBIDDEN);
    if ((role === UserRole.ADMIN || role === UserRole.INSTRUCTOR) && !user)
      throw new HttpException(
        'You are not authorized to register admin / instructor',
        HttpStatus.FORBIDDEN
      );
    if (role === UserRole.ADMIN && user && user.role !== 'SUPER_ADMIN')
      throw new HttpException(
        'Creating Admin is not allowed except for Super Admin',
        HttpStatus.FORBIDDEN
      );
    if (
      role === UserRole.INSTRUCTOR &&
      user &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    )
      throw new HttpException('Creating Admin is not allowed for Student', HttpStatus.FORBIDDEN);

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
        name,
      },
    });
    return {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: { email: newUser.email, role: newUser.role, phone: newUser.phone },
    };
  }

  // Refresh Token
  async refreshToken(token: string):Promise<ApiResponse<{
    accessToken: string;
  }>> {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const user = await this.db.user.findUniqueOrThrow({
      where: { email: payload.email, status: Status.ACTIVE },
    });
    const accessToken = this.jwtService.sign(
      { email: user.email, role: user.role },
      { secret: this.configService.get('JWT_ACCESS_SECRET') },
    );
    return {
      statusCode: 200,
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
    }
  }

  // Forgot
  async forgotPassword(email: string):Promise<ApiResponse<null>> {
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

    return {
      statusCode: 200,
      success: true,
      message: 'Reset password link sent successfully',
      data: null,
    }
  }
}
