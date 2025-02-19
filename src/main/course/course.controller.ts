import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './course.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR]))
  public async createCourse(@Body() data: CreateCourseDto) {
    return await this.courseService.createCourse(data);
  }
}
