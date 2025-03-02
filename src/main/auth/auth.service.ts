import {
  Injectable,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Status, UserRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { ChangePasswordDto, RegisterDto } from './auth.Dto';
import { MailerService } from 'src/utils/sendMail';
import { ApiResponse } from 'src/utils/sendResponse';
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

    const payload =   { email: user.email, role: user.role, id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('REFRESH_SECRET'),
    });

    return {
      accessToken,
      refreshToken,
      user:{
        email: user.email,
        role: user.role,
        id: user.id,
        name: user.name,
      }
    };
  }

  // ---------------------------------Register----------------------------------------
  public async registerUser(registerDto: RegisterDto): Promise<ApiResponse<{
      name: string;
      email: string;
      role: UserRole;
    }>> {
    const { email, password, name } = registerDto;
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
        role: UserRole.STUDENT,
        status: Status.ACTIVE,
        name
      },
    });

    await this.db.student.create({
      data: {
        email,
        name,
        userId: newUser.id
      },
    });
    return {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: { name: newUser.name, email: newUser.email, role: newUser.role },
    };
  }

  // ------------------------------------------------Refresh Token----------------------------------------------
  async refreshToken(token: string): Promise<ApiResponse<{accessToken: string}>> {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('REFRESH_SECRET'),
    });
    const user = await this.db.user.findUnique({
      where: { email: payload.email, status: Status.ACTIVE },
    });
    if (!user) throw new HttpException('User not found', 401);
    const accessToken = this.jwtService.sign(
      { email: user.email, role: user.role },
      { secret: this.configService.get('JWT_SECRET') },
    );
    return {
      statusCode: 200,
      success: true,
      message: 'Please check your mail',
      data: { accessToken },
    }
  }

  // ---------------------------------------------------Forgot Password-------------------------------------------------
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const user = await this.db.user.findUnique({
      where: { email, status: Status.ACTIVE },
    });

    if (!user) throw new HttpException('User not found', 401);

    const token = this.jwtService.sign(
      { email: user.email, role: user.role },
      { secret: this.configService.get('JWT_SECRET') },
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
      message: 'Please check your mail',
      data: null,
    }
  }

  // ----------------------------------------------Change Password-------------------------------------------------
  public async changePassword (user: TUser, payload: ChangePasswordDto): Promise<ApiResponse<null>> {
    const userData = await this.db.user.findUniqueOrThrow({
      where: {
        email: user?.email,
        status: Status.ACTIVE,
      },
    });
  
    const isCorrectPassword: boolean = await bcrypt.compare(
      payload.oldPassword,
      userData.password
    );
    if (!isCorrectPassword) {
      throw new Error("Password is incorrect");
    }
  
    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);
  
    // Update operation
    await this.db.user.update({
      where: {
        email: userData?.email,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully!',
      data: null,
    }
  };
}