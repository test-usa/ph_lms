import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import { Request } from 'express';
import { IdDto } from 'src/common/id.dto';
import { UpdateStudentDto } from './student.Dto';

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

    @Put('update-student/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async updateStudent(@Param() id: IdDto, @Body() data: UpdateStudentDto, @Req() req: Request) {
        return this.studentService.updateStudent(id, data, req.user);
    }

    @Delete('delete-student/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN,]))
    async deleteStudent(@Param() id: IdDto) {
        return this.studentService.deleteStudent(id);
    }
}
