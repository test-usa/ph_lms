import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  CreateCourseDto,
} from './course.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';
import { IdDto } from 'src/common/id.dto';
import { Request } from 'express';
import pick from 'src/utils/pick';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) { }

  // Create Course
  @Post()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN]),
  )
  public async createCourse(@Body() data: CreateCourseDto) {
    return await this.courseService.createCourse(data);
  }

  // Get single Course
  @Get(':id')
  @UseGuards(AuthGuard)
  public async getSingleCourse(@Param() id: IdDto) {
    return await this.courseService.getSingleCourse(id);
  }
  // Get all Courses
  @Get()
  async getAllCourses(@Req() req: Request) {
    const filters = pick(req.query, ['title', 'searchTerm', 'isPublished']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    return this.courseService.getAllCourses(filters, options);
  }


  // @Patch('update')
  // @ApiBearerAuth()
  // @UseGuards(
  //   AuthGuard,
  //   RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  // )
  // public async updateCourse(@Body() data: UpdateCourseDto) {
  //   return await this.courseService.updateCourse(data);
  // }


  // @Get('getAllByStudent')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  // public async getAllCoursesByStudent(
  //   @Query() pagination: PaginationDto,
  //   @Req() req: Request,
  // ) {
  //   return await this.courseService.getAllCoursesByStudent({
  //     pagination,
  //     user: req.user,
  //   });
  // }


  // @Get('getSingle/:id')
  // @ApiBearerAuth()
  // @UseGuards(
  //   AuthGuard,
  //   RoleGuardWith([UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  // )
  // public async getSingleCourse(@Param() id: IdDto) {
  //   return await this.courseService.getSingleCourse(id);
  // }


  // @Get('getSingleByStudent/:id')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  // public async getSingleCourseByStudent(
  //   @Param() id: IdDto,
  //   @Req() req: Request,
  // ) {
  //   return await this.courseService.getSingleCourseByStudent({
  //     courseId: id,
  //     user: req.user,
  //   });
  // }


  // @Post('publish_or_unpublish')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  // public async changePublishStatus(@Body() data: PublishOrUnpublishCourseDto) {
  //   return await this.courseService.changePublishStatus(data);
  // }


  // @Get('allContents/:id')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // public async allContents(@Param() param: IdDto) {
  //   return await this.courseService.allContents(param.id);
  // }
}
