import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginDto, ForgotPasswordDto, RegisterDto } from './auth.Dto';
import sendResponse from 'src/utils/sendResponse';

interface CustomRequest extends Request {
  cookies: {
    refreshToken: string; // explicitly type the cookie as a string
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto, @Req() req: Request) {
    return this.authService.registerUser(registerDto, req.user);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: CustomRequest, @Res() res: Response) {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }
}
