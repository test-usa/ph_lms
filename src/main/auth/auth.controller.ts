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
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.loginUser(loginDto);
    const { refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Logged in successfully',
      data: { accessToken },
    });
  }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.registerUser(registerDto);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: CustomRequest, @Res() res: Response) {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }
    const result = await this.authService.refreshToken(refreshToken);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'New Access Token Has Been Generated',
      data: result,
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Please check your mail',
      data: null,
    });
  }
}
