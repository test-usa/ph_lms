import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import sendResponse from 'src/utils/sendResponse';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import { Request, Response } from 'express';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN]))
    async getSingleStudent(@Req() req: Request, @Res() res: Response) {
        const { id } = req.params;
        const result = await this.studentService.getSingleStudent(id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Student's data retrieved Successfully",
            data: result,
        });
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
    async getAllStudents(@Req() req: Request, @Res() res: Response) {
        const filters = pick(req.query, ["email", "searchTerm", "gender", "contact"]);
        const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
        const result = await this.studentService.getAllStudents(filters, options);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "All Students fetched Successfully",
            data: result,
        });
    }

}
