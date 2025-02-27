import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  CreateCourseDto,
  PublishOrUnpublishCourseDto,
  UpdateCourseDto,
} from './course.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Course } from '@prisma/client';
import { PaginationDto } from 'src/common/pagination.dto';
import { IdDto } from 'src/common/id.dto';

@Injectable()
export class CourseService {
  constructor(private db: DbService) {}

  public async createCourse(
    data: CreateCourseDto,
  ): Promise<ApiResponse<Course>> {
    const course = await this.db.course.create({
      data,
    });

    return {
      data: course,
      success: true,
      message: 'Course created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  public async updateCourse({ id, ...data }: UpdateCourseDto) {
    const updated = await this.db.course.update({
      where: { id },
      data,
    });

    if (!updated) {
      return {
        success: false,
        message: 'Course not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: updated,
      success: true,
      message: 'Course updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  public async getAllCourses({
    take = 10,
    skip = 0,
  }: PaginationDto): Promise<ApiResponse<Course[]>> {
    const courses = await this.db.course.findMany({
      take,
      skip,
      orderBy: { id: 'asc' },
    });

    return {
      data: courses,
      success: true,
      message: 'Courses retrieved successfully',
      statusCode: HttpStatus.OK,
    };
  }

  public async getSingleCourse({ id }: IdDto): Promise<ApiResponse<Course>> {
    const course = await this.db.course.findUnique({
      where: { id },
      include: {
        modules: {
          select: {
            title: true,
            id: true,
            content: {
              select: {
                title: true,
                id: true,
                assignment: true,
                QuizInstance: {
                  include: {
                    quiz: true,
                  },
                },
                description: true,
                video: true,
              },
            },
          },
        },
      },
    });

    if (!course)
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

    return {
      data: course,
      success: true,
      message: 'Course retrieved successfully',
      statusCode: HttpStatus.OK,
    };
  }

  public async changePublishStatus({
    courseId,
    isPublished,
  }: PublishOrUnpublishCourseDto): Promise<ApiResponse<Course>> {
    const course = await this.getSingleCourse({ id: courseId });

    if (!course)
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

    const updated = await this.db.course.update({
      where: { id: courseId },
      data: { isPublished },
    });

    return {
      data: updated,
      success: true,
      message: 'Course status updated successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
