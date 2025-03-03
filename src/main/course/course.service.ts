import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  CreateCourseDto,
} from './course.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Course } from '@prisma/client';
import { PaginationDto } from 'src/common/pagination.dto';
import { IdDto } from 'src/common/id.dto';
import { TUser } from 'src/interface/token.type';

@Injectable()
export class CourseService {
  constructor(private db: DbService) { }

  // ------------------------------Create Course-------------------------------------
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

  // ------------------------------Get All Courses-------------------------------------
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

  // public async updateCourse({ id, ...data }: UpdateCourseDto) {
  //   const updated = await this.db.course.update({
  //     where: { id },
  //     data,
  //   });

  //   if (!updated) {
  //     return {
  //       success: false,
  //       message: 'Course not found',
  //       statusCode: HttpStatus.NOT_FOUND,
  //     };
  //   }

  //   return {
  //     data: updated,
  //     success: true,
  //     message: 'Course updated successfully',
  //     statusCode: HttpStatus.OK,
  //   };
  // }


  // public async getAllCoursesByStudent({
  //   pagination,
  //   user,
  // }: {
  //   pagination: PaginationDto;
  //   user: TUser;
  // }): Promise<ApiResponse<Course[]>> {
  //   const courses = await this.db.course.findMany({
  //     take: pagination.take,
  //     skip: pagination.skip,
  //     orderBy: { id: 'asc' },
  //     include: {
  //       student: {
  //         where: {
  //           id: user.id,
  //         },
  //       },
  //     },
  //   });

  //   return {
  //     data: courses,
  //     success: true,
  //     message: 'Courses retrieved successfully',
  //     statusCode: HttpStatus.OK,
  //   };
  // }

  // public async getSingleCourse({ id }: IdDto): Promise<ApiResponse<Course>> {
  //   const course = await this.db.course.findUnique({
  //     where: { id },
  //   });

  //   if (!course)
  //     throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

  //   return {
  //     data: course,
  //     success: true,
  //     message: 'Course retrieved successfully',
  //     statusCode: HttpStatus.OK,
  //   };
  // }

  // public async getSingleCourseByStudent({
  //   courseId,
  //   user,
  // }: {
  //   courseId: IdDto;
  //   user: TUser;
  // }): Promise<ApiResponse<Course>> {
  //   const course = await this.db.course.findUnique({
  //     where: {
  //       id: courseId.id,
  //       student: {
  //         some: {
  //           id: user.id,
  //         },
  //       },
  //     },
  //   });

  //   return {
  //     data: course,
  //     success: true,
  //     message: 'Course retrieved successfully',
  //     statusCode: HttpStatus.OK,
  //   };
  // }

  // public async changePublishStatus({
  //   courseId,
  //   isPublished,
  // }: PublishOrUnpublishCourseDto): Promise<ApiResponse<Course>> {
  //   const course = await this.getSingleCourse({ id: courseId });

  //   if (!course)
  //     throw new HttpException('Course not found', HttpStatus.NOT_FOUND);

  //   const updated = await this.db.course.update({
  //     where: { id: courseId },
  //     data: { isPublished },
  //   });

  //   return {
  //     data: updated,
  //     success: true,
  //     message: 'Course status updated successfully',
  //     statusCode: HttpStatus.OK,
  //   };
  // }


  // public async allContents(id: string): Promise<ApiResponse<string[]>> {
  //   const modules = await this.db.module.findMany({
  //     where: { courseId: id }, // ✅ Use courseId instead of id
  //     select: {
  //       content: {
  //         select: { id: true },
  //       },
  //     },
  //   });

  //   const contentIds = modules.flatMap(module => module.content.map(content => content.id));
  //   return {
  //     data: contentIds,
  //     success: true,
  //     message: 'All content IDs for the specified course',
  //     statusCode: HttpStatus.OK,
  //   };
  // }

}
