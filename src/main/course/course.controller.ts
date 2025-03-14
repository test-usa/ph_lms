import {
  Body,
  Controller,
  Delete,
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
  AddInstructorToCourseDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './course.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
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
    RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  public async createCourse(@Body() data: CreateCourseDto) {
    return await this.courseService.createCourse(data);
  }

  // Get single Course
  @Get(':id')
  @UseGuards(AuthGuard)
  public async getSingleCourse(@Param() id: IdDto, @Req() req: Request) {
    return await this.courseService.getSingleCourse(id, req.user);
  }

  // Get all Courses
  @Get()
  async getAllCourses(@Req() req: Request) {
    const filters = pick(req.query, ['title', 'searchTerm', 'isPublished']);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    return this.courseService.getAllCourses(filters, options);
  }

   // Update Course
   @Patch(':id')
   @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]),)
   public async updateCourse(@Param() id: IdDto, @Body() data: UpdateCourseDto) {
     return await this.courseService.updateCourse(id, data);
   }

   // Delete Course
   @Delete(':id')
   @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]),)
   public async deleteCourse(@Param() param: IdDto) {
     return await this.courseService.deleteCourse(param.id);
   }

   // Add Instructor to Course
   @Patch('add-instructor/:id')
   @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]),)
   public async addInstructorToCourse(@Param() param: IdDto, @Body() body: AddInstructorToCourseDto) {
     return await this.courseService.addInstructorToCourse(param, body);
   }

   // Remove Instructor from Course
   @Patch('remove-instructor/:id')
   @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]),)
   public async removeInstructorFromCourse(@Param() param: IdDto) {
     return await this.courseService.removeInstructorFromCourse(param);
   }

}
