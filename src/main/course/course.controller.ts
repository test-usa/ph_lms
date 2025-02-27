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
  PublishOrUnpublishCourseDto,
  UpdateCourseDto,
} from './course.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';
import { IdDto } from 'src/common/id.dto';
import { Request } from 'express';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  /**
   * Create a New Course
   * 
   * This method creates a new course by an instructor or admin.
   * @param data - The data to create the new course.
   * @returns The created course.
   */
  @Post('create')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN]),
  )
  public async createCourse(@Body() data: CreateCourseDto) {
    return await this.courseService.createCourse(data);
  }

  /**
   * Update an Existing Course
   * 
   * This method allows an instructor or admin to update an existing course.
   * @param data - The updated course data.
   * @returns The updated course.
   */
  @Patch('update')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  public async updateCourse(@Body() data: UpdateCourseDto) {
    return await this.courseService.updateCourse(data);
  }

  /**
   * Get All Courses with Pagination
   * 
   * This method retrieves all courses with pagination. Available to admins, instructors, students, and super admins.
   * @param pagination - Pagination data to control the number of courses retrieved.
   * @returns A list of all courses.
   */
  @Get('getAll')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([
      UserRole.ADMIN,
      UserRole.INSTRUCTOR,
      UserRole.STUDENT,
      UserRole.SUPER_ADMIN,
    ]),
  )
  public async getAllCourses(@Query() pagination: PaginationDto) {
    return await this.courseService.getAllCourses(pagination);
  }

  /**
   * Get All Courses for a Student
   * 
   * This method retrieves all courses a specific student is enrolled in with pagination.
   * @param pagination - Pagination data to control the number of courses retrieved.
   * @param req - The request object containing the logged-in user's data.
   * @returns A list of courses that the student is enrolled in.
   */
  @Get('getAllByStudent')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  public async getAllCoursesByStudent(
    @Query() pagination: PaginationDto,
    @Req() req: Request,
  ) {
    return await this.courseService.getAllCoursesByStudent({
      pagination,
      user: req.user,
    });
  }

  /**
   * Get a Single Course by ID
   * 
   * This method retrieves a single course by its ID. Available to instructors, admins, and super admins.
   * @param id - The ID of the course to retrieve.
   * @returns The details of the course.
   */
  @Get('getSingle/:id')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  )
  public async getSingleCourse(@Param() id: IdDto) {
    return await this.courseService.getSingleCourse(id);
  }

  /**
   * Get a Single Course for a Student
   * 
   * This method retrieves a specific course by its ID for a student.
   * @param id - The ID of the course to retrieve.
   * @param req - The request object containing the logged-in student's data.
   * @returns The course details available for the student.
   */
  @Get('getSingleByStudent/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  public async getSingleCourseByStudent(
    @Param() id: IdDto,
    @Req() req: Request,
  ) {
    return await this.courseService.getSingleCourseByStudent({
      courseId: id,
      user: req.user,
    });
  }

  /**
   * Change the Publish Status of a Course
   * 
   * This method allows an admin or super admin to publish or unpublish a course.
   * @param data - The data containing the course ID and the desired publish status.
   * @returns The updated course with its new publish status.
   */
  @Post('publish_or_unpublish')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  public async changePublishStatus(@Body() data: PublishOrUnpublishCourseDto) {
    return await this.courseService.changePublishStatus(data);
  }
}
