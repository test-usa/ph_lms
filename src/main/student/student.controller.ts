import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import pick from 'src/utils/pick';
import { Request } from 'express';
import { IdDto } from 'src/common/id.dto';
import { UpdateStudentDto } from './student.Dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN]),
  )
  async getSingleStudent(@Param() id: IdDto) {
    return this.studentService.getSingleStudent(id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student data by filter' })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filter by student email',
  })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    type: String,
    description: 'Search by name or other fields',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    enum: ['Male', 'Female', 'Other'],
    description: 'Filter by gender',
  })
  @ApiQuery({
    name: 'contact',
    required: false,
    type: String,
    description: 'Filter by contact number',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of records per page',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'email', 'gender'],
    description: 'Sort results by a specific field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sorting order (ascending/descending)',
  })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async getAllStudents(@Req() req: Request) {
    const filters = pick(req.query, [
      'email',
      'searchTerm',
      'gender',
      'contact',
    ]);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    return this.studentService.getAllStudents(filters, options);
  }

  @Put('update-student/:id')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.STUDENT, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  async updateStudent(
    @Param() id: IdDto,
    @Body() data: UpdateStudentDto,
    @Req() req: Request,
  ) {
    return this.studentService.updateStudent(id, data, req.user);
  }

  @Delete('delete-student/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteStudent(@Param() id: IdDto) {
    return this.studentService.deleteStudent(id);
  }

  @Post(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calculate progress of student' })
  @UseGuards(AuthGuard)
  async calculateProgress(@Param() id: IdDto, @Req() req: Request) {
    const email = req.user.email;
    return this.studentService.calculateProgress(id.id, email);
  }
}
