import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
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
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN]))
  async getSingleStudent(@Param() id: IdDto) {
    return this.studentService.getSingleStudent(id);
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async getAllStudents(@Req() req: Request) {
    const filters = pick(req.query, ['email', 'searchTerm', 'gender', 'contact']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    return this.studentService.getAllStudents(filters, options);
  }

  @Patch('update-student/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateStudent(@Param() id: IdDto, @Body() data: UpdateStudentDto, @Req() req: Request) {
    return this.studentService.updateStudent(id, data, req.user);
  }

  @Delete('delete-student/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteStudent(@Param() id: IdDto) {
    return this.studentService.deleteStudent(id);
  }

  @Post('progress/:courseId/:contentId')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async setProgress(@Param() param, @Req() req: Request) {
    const email = req.user.email;
    return this.studentService.setProgress(param.courseId, email, param.contentId);
  }

  @Get('progress/:courseId')
  @UseGuards(AuthGuard)
  async getProgress(@Param() param, @Req() req: Request) {
    const email = req.user.email;
    return this.studentService.getProgress(param.courseId, email);
  }
}
