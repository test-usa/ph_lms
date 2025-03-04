import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  CreateCourseDto,
} from './course.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Course, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/pagination.dto';
import { IdDto } from 'src/common/id.dto';
import { TUser } from 'src/interface/token.type';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';

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

  // ------------------------------Get Single Course-------------------------------------
  public async getSingleCourse(id: IdDto): Promise<ApiResponse<Course>> {
    const courses = await this.db.course.findUnique({
      where: id,
      include: {
        module: {
          include: {
            content: {
              include: {
                quiz: {
                  include: {
                    quiz: true
                  }
                },
                assignment: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Courses retrieved successfully',
      statusCode: HttpStatus.OK,
      data: courses,
    };
  }

  //--------------------------------------Get All Courses------------------------------------------
  public async getAllCourses(
    params: any,
    options: TPaginationOptions,
  ): Promise<ApiResponse<Course[]>> {
    const andConditions: Prisma.CourseWhereInput[] = [];
    const { searchTerm, ...filteredData } = params;
    const { page, limit, skip } = calculatePagination(options);

    if (searchTerm) {
      andConditions.push({
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
        ],
      });
    }

    if (Object.keys(filteredData).length > 0) {
      andConditions.push({
        AND: Object.keys(filteredData).map((key) => ({
          [key]: {
            equals: filteredData[key],
          },
        })),
      });
    }

    const result = await this.db.course.findMany({
      where: {
        AND: andConditions,
      },
      skip: skip,
      take: limit,
      orderBy: options.sortBy
        ? options.sortOrder
          ? {
            [options.sortBy]: options.sortOrder,
          }
          : {
            [options.sortBy]: 'asc',
          }
        : {
          createdAt: 'desc',
        },
      include: {
        module: {
          select: {
            title: true,
          },
        },
      },
    });

    const total = await this.db.course.count({
      where: {
        AND: andConditions,
      },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Courses retrieved successfully',
      meta: {
        page,
        limit,
        total,
      },
      data: result,
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
