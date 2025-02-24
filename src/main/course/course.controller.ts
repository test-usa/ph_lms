import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';
import { IdDto } from 'src/common/id.dto';


@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) { }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN]))
  public async createCourse(@Body() data: CreateCourseDto) {
    return await this.courseService.createCourse(data);
  }

  @Patch('update')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  public async updateCourse(@Body() data: UpdateCourseDto) {
    return await this.courseService.updateCourse(data);
  }

  @Get('getAll')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]))
  public async getAllCourses(@Query() pagination: PaginationDto) {
    return await this.courseService.getAllCourses(pagination);
  }

  @Get('getSingle/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  public async getSingleCourse(@Param() id: IdDto) {
    return await this.courseService.getSingleCourse(id);
  }
}
