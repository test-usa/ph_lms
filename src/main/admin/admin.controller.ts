import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import { Request } from 'express';
import { IdDto } from 'src/common/id.dto';
import { UpdateAdminDto } from './admin.Dto';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
    async getSingleAdmin(@Param() id: IdDto) {
        return this.adminService.getSingleAdmin(id);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
    async getAllAdmins(@Req() req: Request) {
        const filters = pick(req.query, ["email", "searchTerm", "gender", "contact"]);
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        return this.adminService.getAllAdmins(filters, options);
    }

    @Put('update-admin/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async updateAdmin(@Param() id: IdDto, @Body() data: UpdateAdminDto, @Req() req:Request) {
        return this.adminService.updateAdmin(id, data, req.user);
    }

    @Delete('delete-admin/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN]))
    async deleteAdmin(@Param() id: IdDto) {
        return this.adminService.deleteAdmin(id);
    }
}
