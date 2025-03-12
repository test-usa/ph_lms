import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import { Request } from 'express';
import { IdDto } from 'src/common/id.dto';
import { UpdateInstructorDto } from './instructor.Dto';

@Controller('instructor')
export class InstructorController {
    constructor(private readonly instructorService: InstructorService) { }

    @Get(':id')
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
    async getSingleInstructor(@Param() id: IdDto) {
        return this.instructorService.getSingleInstructor(id);
    }

    @Get()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.SUPER_ADMIN, UserRole.ADMIN]))
    async getAllInstructors(@Req() req: Request) {
        const filters = pick(req.query, ["email", "searchTerm", "gender", "contact"]);
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        return this.instructorService.getAllInstructors(filters, options);
    }

    @Put('update-instructor/:id')
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async updateInstructor(@Param() id: IdDto, @Body() data: UpdateInstructorDto, @Req() req: Request) {
        return this.instructorService.updateInstructor(id, data, req.user);
    }

    @Delete('delete-instructor/:id')
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async deleteInstructor(@Param() id: IdDto) {
        return this.instructorService.deleteInstructor(id);
    }
}
