import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, PublishOrUnpublishCourseDto, UpdateCourseDto } from './course.dto';
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
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT, UserRole.SUPER_ADMIN]))
  public async getAllCourses(@Query() pagination: PaginationDto) {
    return await this.courseService.getAllCourses(pagination);
  }

  @Get('getSingle/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  public async getSingleCourse(@Param() id: IdDto) {
    return await this.courseService.getSingleCourse(id);
  }

  @Post('publish_or_unpublish')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  public async changePublishStatus(@Body() data: PublishOrUnpublishCourseDto) {
    return await this.courseService.changePublishStatus(data);
  }
}
