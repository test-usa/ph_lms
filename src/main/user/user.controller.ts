import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import sendResponse from 'src/utils/sendResponse';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import {
  ChangeProfileStatusDto,
  CreateAnUserDto,
} from './user.Dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get me
  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getUser(@Req() req: Request) {
    return this.userService.getMe(req.user);
  }

  // Get All users
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async getAllUser(@Req() req: Request, @Res() res: Response) {
    const filters = pick(req.query, ['email', 'searchTerm', 'role', 'status']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await this.userService.getAllUsers(filters, options);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All Users fetched Successfully',
      data: result,
    });
  }

  // Change Profile status
  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async changeProfileStatus(
    @Body() changeProfileStatusDto: ChangeProfileStatusDto,
    @Req() req: Request,
  ) {
    const { id } = req.params;
    return await this.userService.changeProfileStatus(id, changeProfileStatusDto.status)
  }

  // Create Instructor
  @Post('instructor/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async createInstructor(@Body() createAnUserDto: CreateAnUserDto) {
    return this.userService.createInstructor(createAnUserDto);
  }

  // Create Admin
  @Post('admin/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
  async createAdmin(@Body() createAnUserDto: CreateAnUserDto) {
    return this.userService.createAdmin(createAnUserDto);
  }
}