import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ApiResponse } from 'src/utils/sendResponse';
import { Module, UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { CreateModuleDto } from './module.dto';
import { TUser } from 'src/interface/token.type';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: DbService) { }

  //----------------------------------------Create Module-----------------------------------------------
  async createModule(dto: CreateModuleDto, id: string): Promise<ApiResponse<Module>> {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      include: {
        instructor: {
          include: {
            user: true
          }
        }
      },
    });
    const instructor = await this.prisma.instructor.findUniqueOrThrow({
      where: { userId: id }
    })

    if (!existingCourse) throw new HttpException('Course not found', 404);
    if (!existingCourse?.instructor) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);
    if (existingCourse?.instructor?.id !== instructor?.id) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);

    const data = await this.prisma.module.create({
      data: {
        ...dto,
        courseId: dto.courseId as string,
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Module created successfully',
      data,
    };
  }

  //----------------------------------------Get All Modules by Course ID---------------------------------
  async findAll(params: any, user:TUser): Promise<ApiResponse<any>> {
    if (user.role === 'INSTRUCTOR') {
      const instructor = await this.prisma.instructor.findUnique({
        where: { courseId: params.courseId }
      })
      if (!instructor) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }
    if (user.role === 'STUDENT') {
      const student = await this.prisma.student.findFirst({
        where: { courseId: params.courseId }
      })
      if (!student) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }
    const data = await this.prisma.module.findMany({
      where: { courseId: params.courseId },
      include: {
        content: {
          select: {
            title: true,
            id: true,
            video: true,
            description: true,
            contentType: true,
            quiz: {
              select: {
                quiz: true
              }
            }
          },
        },
      },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Modules retrieved successfully',
      data,
    };
  }

  //----------------------------------------Get Module by ID--------------------------------------------
  async findOne(params: IdDto, user: TUser): Promise<ApiResponse<Module>> {
    const module = await this.prisma.module.findUnique({
      where: { id: params.id },
      include: { content: true },
    });
    if (!module) {
      throw new HttpException('Module not found', 404);
    }

    if (user.role === 'INSTRUCTOR') {
      const instructor = await this.prisma.instructor.findUnique({
        where: { courseId: module.courseId }
      })
      if (!instructor) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }
    if (user.role === 'STUDENT') {
      const student = await this.prisma.student.findFirst({
        where: { courseId: module.courseId }
      })
      if (!student) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Module retrieved successfully',
      data: module,
    };
  }

  //----------------------------------------Update Module Title----------------------------------------------
  async updateModuleTitle(params: IdDto, title: string, id: string): Promise<ApiResponse<Module>> {
    const existingModule = await this.prisma.module.findUnique({
      where: { id: params.id },
      include: {
        course: {
          include: {
            instructor: {
              include: {
                user: true,
              },
            }
          }
        }
      },
    });
    const instructor = await this.prisma.instructor.findUniqueOrThrow({
      where: { userId: id }
    })

    if (!existingModule) throw new HttpException('Module not found', 404);
    if (!existingModule?.course?.instructor) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);
    if (existingModule?.course?.instructor?.id !== instructor?.id) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);

    const module = await this.prisma.module.update({
      where: { id: params.id },
      data: { title }, // Only update the title field
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Module title updated successfully',
      data: module,
    };
  }

  //----------------------------------------Delete Module with Rollback---------------------------------
  async remove(params: IdDto, user: TUser): Promise<ApiResponse<null>> {
    const existingModule = await this.prisma.module.findUnique({
      where: { id: params.id },
      include: {
        course: {
          include: {
            instructor: {
              include: {
                user: true,
              },
            }
          }
        }
      },
    });

    const instructor = await this.prisma.instructor.findUniqueOrThrow({
      where: { userId: user?.id }
    })

    if (!existingModule) throw new HttpException('Module not found', 404);
    if (!existingModule?.course?.instructor) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);
    if (existingModule?.course?.instructor?.id !== instructor?.id) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);

    return this.prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({
        where: { id: params.id },
        include: {
          course: {
            include: {
              instructor: {
                include: {
                  user: true,
                },
              }
            }
          },
          content: {
            include: {
              quiz: {
                include: {
                  quiz: true,
                  quizSubmission: true,
                },
              },
              assignment: {
                include: {
                  assignmentSubmission: true,
                },
              },
            },
          },
        },
      });

      const instructor = await this.prisma.instructor.findUniqueOrThrow({
        where: { userId: user?.id }
      })

      if (!module) throw new HttpException('Module not found', 404);
      if (user?.role == UserRole.INSTRUCTOR) {
        if (!module?.course?.instructor) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);
        if (module?.course?.instructor?.id !== instructor.id) throw new HttpException('You are not authorized for this module!', HttpStatus.BAD_GATEWAY);
      }


      for (const content of module.content) {
        if (content.quiz) {
          await tx.quizSubmission.deleteMany({
            where: { quizInstanceId: content.quiz.id },
          });
          await tx.quiz.deleteMany({
            where: { quizInstanceId: content.quiz.id },
          });
          await tx.quizInstance.delete({
            where: { id: content.quiz.id },
          });
        }

        if (content.assignment) {
          await tx.assignmentSubmission.deleteMany({
            where: { assignmentId: content.assignment.id },
          });
          await tx.assignment.delete({
            where: { id: content.assignment.id },
          });
        }

        await tx.content.delete({
          where: { id: content.id },
        });
      }

      await tx.module.delete({
        where: { id: params.id },
      });

      return {
        success: true,
        message: 'Module and associated data deleted successfully',
        statusCode: 200,
        data: null,
      };
    });
  }
}
