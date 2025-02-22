import { Controller, Get, HttpCode, Req, Res, UseGuards, Param, Body, Put, Delete, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import sendResponse from 'src/utils/sendResponse';
import { AdminService } from './admin.service';
import { UpdateAdminProfileDto } from './admin.Dto';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('allAdmin')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN]))
  async getAllAdmin(@Res() res: Response) {
    const result = await this.adminService.getAllAdmin();
    sendResponse(res, {
      success: true,
      message: 'All admins retrieved successfully',
      statusCode: 200,
      data: result,
    });
  }

  @Get('singleAdmin/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN]))
  async getSingleAdmin(@Res() res: Response, @Param('id') id: string) {
    const result = await this.adminService.getSingleAdmin(id);
    sendResponse(res, {
      success: true,
      message: 'Single admin retrieved successfully',
      statusCode: 200,
      data: result,
    });
  }

  @Delete('deleteAdmin/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN]))
  async deleteAdmin(@Res() res: Response, @Param('id') id: string) {
    const result = await this.adminService.deleteAdmin(id);
    sendResponse(res, {
      success: true,
      message: 'Admin deleted successfully',
      statusCode: 200,
      data: result,
    });
  }

  @Patch('updateAdminProfile/:id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateAdminProfileDto })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN]))
  async updateAdminProfile(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() payload: UpdateAdminProfileDto,
  ) {
    const result = await this.adminService.updateAdmin(id, payload);
    sendResponse(res, {
      success: true,
      message: 'Admin profile updated successfully',
      statusCode: 200,
      data: result,
    });
  }
}