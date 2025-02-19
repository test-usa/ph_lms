import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import sendResponse from 'src/utils/sendResponse';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]))
  async getUser(@Req() req: Request, @Res() res: Response) {
    const result = await this.userService.getUser(req.user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User data fetched Successfully',
      data: result,
    });
  }
}
