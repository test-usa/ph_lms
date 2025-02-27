import { Body, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import { Request } from 'express';
import { IdDto } from 'src/common/id.dto';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN]))
    async getSingleStudent(@Param() id: IdDto) {
        return this.studentService.getSingleStudent(id);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async getAllStudents(@Req() req: Request) {
        const filters = pick(req.query, ["email", "searchTerm", "gender", "contact"]);
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        return this.studentService.getAllStudents(filters, options);
    }

}
