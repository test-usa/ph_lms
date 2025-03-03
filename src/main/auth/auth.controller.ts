import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginDto, ForgotPasswordDto, RegisterDto, ChangePasswordDto } from './auth.Dto';
import sendResponse from 'src/utils/sendResponse';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

interface CustomRequest extends Request {
  cookies: {
    refreshToken: string; // explicitly type the cookie as a string
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.loginUser(loginDto);
    const { accessToken, user } = result;
    // res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Logged in successfully',
      data: { accessToken, user },
    });
  }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  // @Post('refresh-token')
  // async refreshToken(@Req() req: CustomRequest, @Res() res: Response) {
  //   const refreshToken: string = req.cookies.refreshToken;
  //   if (!refreshToken) {
  //     throw new UnauthorizedException('Refresh token not provided');
  //   }
  //   return await this.authService.refreshToken(refreshToken);
  // }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // Change Password
  @Patch('change-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: Request) {
    console.log(req.user)
    return this.authService.changePassword(req.user, changePasswordDto);
  }
}
