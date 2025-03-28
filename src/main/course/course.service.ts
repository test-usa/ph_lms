import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  AddInstructorToCourseDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './course.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Course, Prisma } from '@prisma/client';
import { PaginationDto } from 'src/common/pagination.dto';
import { IdDto } from 'src/common/id.dto';
import { TUser } from 'src/interface/token.type';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';
import { NotFoundError } from 'rxjs';

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

  // ------------------------------------Get Single Course-------------------------------------
  public async getSingleCourse(id: IdDto, user: TUser): Promise<ApiResponse<Course>> {
    if (user.role === 'INSTRUCTOR') {
      const instructor = await this.db.instructor.findUnique({
        where: { courseId: id.id }
      })
      if (!instructor) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }
    if (user.role === 'STUDENT') {
      const student = await this.db.student.findFirst({
        where: { courseId: id.id }
      })
      if (!student) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }
    const course = await this.db.course.findUnique({
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
        instructor: true,
        student: true
      },
    });

    return {
      success: true,
      message: 'Courses retrieved successfully',
      statusCode: HttpStatus.OK,
      data: course,
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

  //---------------------------------------Update Course--------------------------------------------
  public async updateCourse(id: IdDto, data: UpdateCourseDto) {
    const course = await this.db.course.findUnique({
      where: id
    })
    if (!course) throw new HttpException("Course Not Found", 404)

    const updated = await this.db.course.update({
      where: id,
      data,
    });

    return {
      success: true,
      message: 'Course updated successfully',
      statusCode: HttpStatus.OK,
      data: updated,
    };
  }

  //-------------------------------------Delete Course-----------------------------------------
  public async deleteCourse(courseId: string): Promise<ApiResponse<null>> {
    return this.db.$transaction(async (tx) => {
      // Transaction - 01: Delete all QuizSubmissions
      await tx.quizSubmission.deleteMany({
        where: {
          quizInstance: {
            content: {
              module: {
                courseId,
              },
            },
          },
        },
      });

      // Transaction - 02: Delete all Quizzes
      await tx.quiz.deleteMany({
        where: {
          quizInstance: {
            content: {
              module: {
                courseId,
              },
            },
          },
        },
      });

      // Transaction - 03: Delete all QuizInstances
      await tx.quizInstance.deleteMany({
        where: {
          content: {
            module: {
              courseId,
            },
          },
        },
      });

      // Transaction - 04: Delete all AssignmentSubmissions
      await tx.assignmentSubmission.deleteMany({
        where: {
          assignment: {
            content: {
              module: {
                courseId,
              },
            },
          },
        },
      });

      // Transaction - 05: Delete all Assignments
      await tx.assignment.deleteMany({
        where: {
          content: {
            module: {
              courseId,
            },
          },
        },
      });

      // Transaction - 06: Delete all Progress records (for the course and its contents)
      await tx.progress.deleteMany({
        where: {
          OR: [
            { courseId },
            {
              content: {
                module: {
                  courseId,
                },
              },
            },
          ],
        },
      });

      // Transaction - 07: Delete all Contents
      await tx.content.deleteMany({
        where: {
          module: {
            courseId,
          },
        },
      });

      // Transaction - 08: Delete all Modules
      await tx.module.deleteMany({
        where: {
          courseId,
        },
      });

      // Transaction - 09: Delete associated Payment records
      await tx.payment.deleteMany({
        where: {
          course: {
            some: {
              id: courseId,
            },
          },
        },
      });

      // Transaction - 11: Delete Student records (if courseId is assigned)
      await tx.student.updateMany({
        where: {
          courseId,
        },
        data: {
          courseId: null, // Set courseId to null, as the course is deleted
        },
      });

      // Transaction - 12: Delete Instructor record (if courseId is assigned)
      await tx.instructor.updateMany({
        where: {
          courseId,
        },
        data: {
          courseId: null, // Set courseId to null, as the course is deleted
        },
      });

      // Transaction - 13: Finally, delete the Course
      await tx.course.delete({
        where: {
          id: courseId,
        },
      });

      return {
        statusCode: 200,
        success: true,
        message: 'Course and all related data deleted successfully',
        data: null,
      };
    });
  }

  //------------------------------------Add Instructor To Course----------------------------------------------
  public async addInstructorToCourse(id: IdDto, payload: AddInstructorToCourseDto) {
    const course = await this.db.course.findUnique({
      where: id,
      include: { instructor: true }
    });
    if (!course) throw new HttpException('Course Not Found', 404);
    if (course?.instructor) throw new HttpException('An Instructor already assigned to this course', 404);

    const requestedInstructor = await this.db.instructor.findUniqueOrThrow({
      where: {
        id: payload.instructorId,
        isDeleted: false
      }
    });
    if (!requestedInstructor) throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);

    const instructor = await this.db.instructor.update({
      where: { id: payload.instructorId },
      data: {
        courseId: id.id,
      },
    });

    return {
      success: true,
      message: 'Instructor added to course successfully',
      statusCode: HttpStatus.OK,
      data: instructor,
    };
  }

  public async removeInstructorFromCourse(id: IdDto) {
    const course = await this.db.course.findUnique({
      where: id,
      include: { instructor: true }
    });
    if (!course) throw new HttpException('Course Not Found', 404);
    if (!course?.instructor) throw new HttpException('No Instructor assigned to this course', 404);

    const instructor = await this.db.instructor.update({
      where: { id: course.instructor.id },
      data: {
        courseId: null,
      },
    });

    return {
      success: true,
      message: 'Instructor removed from course successfully',
      statusCode: HttpStatus.OK,
      data: instructor,
    };
   }


}
