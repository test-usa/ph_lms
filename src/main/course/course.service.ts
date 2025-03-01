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
import { TUser } from 'src/interface/token.type';

@Injectable()
export class CourseService {
  constructor(private db: DbService) {}

  /**
   * Create a New Course
   * 
   * This method creates a new course in the database.
   * @param data - The data required to create the course.
   * @returns The created course.
   */
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

  /**
   * Update an Existing Course
   * 
   * This method updates the details of an existing course.
   * @param id - The ID of the course to update.
   * @param data - The data to update the course with.
   * @returns The updated course.
   */
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

  /**
   * Get All Courses with Pagination
   * 
   * This method retrieves a paginated list of all courses.
   * @param take - The number of courses to retrieve.
   * @param skip - The number of courses to skip (for pagination).
   * @returns A list of courses.
   */
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

  /**
   * Get All Courses for a Student
   * 
   * This method retrieves all courses that a specific student is enrolled in.
   * @param pagination - The pagination data.
   * @param user - The user data of the student.
   * @returns A list of courses that the student is enrolled in.
   */
  public async getAllCoursesByStudent({
    pagination,
    user,
  }: {
    pagination: PaginationDto;
    user: TUser;
  }): Promise<ApiResponse<Course[]>> {
    const courses = await this.db.course.findMany({
      take: pagination.take,
      skip: pagination.skip,
      orderBy: { id: 'asc' },
      include: {
        student: {
          where: {
            id: user.id,
          },
        },
      },
    });

    return {
      data: courses,
      success: true,
      message: 'Courses retrieved successfully',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Get a Single Course by ID
   * 
   * This method retrieves the details of a specific course by its ID, including modules and content.
   * @param id - The ID of the course to retrieve.
   * @returns The course data.
   */
  public async getSingleCourse({ id }: IdDto): Promise<ApiResponse<Course>> {
    const course = await this.db.course.findUnique({
      where: { id },
      // include: {
      //   modules: {
      //     select: {
      //       title: true,
      //       id: true,
      //       content: {
      //         select: {
      //           title: true,
      //           id: true,
      //           QuizInstance: {
      //             include: {
      //               quiz: true,
      //             },
      //           },
      //           description: true,
      //           video: true,
      //         },
      //       },
      //     },
      //   },
      // },
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

  /**
   * Get a Single Course for a Student
   * 
   * This method retrieves a specific course for a student, including modules and content.
   * @param courseId - The ID of the course.
   * @param user - The user data of the student.
   * @returns The course data for the student.
   */
  public async getSingleCourseByStudent({
    courseId,
    user,
  }: {
    courseId: IdDto;
    user: TUser;
  }): Promise<ApiResponse<Course>> {
    const course = await this.db.course.findUnique({
      where: {
        id: courseId.id,
        student: {
          some: {
            id: user.id,
          },
        },
      },
      // include: {
      //   modules: {
      //     select: {
      //       title: true,
      //       id: true,
      //       content: {
      //         select: {
      //           title: true,
      //           id: true,
      //           QuizInstance: {
      //             include: {
      //               quiz: true,
      //             },
      //           },
      //           description: true,
      //           video: true,
      //         },
      //       },
      //     },
      //   },
      // },
    });

    return {
      data: course,
      success: true,
      message: 'Course retrieved successfully',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Change the Publish Status of a Course
   * 
   * This method updates the publish status of a course.
   * @param courseId - The ID of the course to update.
   * @param isPublished - The new publish status (true or false).
   * @returns The updated course.
   */
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
