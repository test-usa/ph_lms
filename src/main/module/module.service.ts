import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ApiResponse } from 'src/utils/sendResponse';
import { Module } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { CreateModuleDto } from './module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: DbService) { }

  //----------------------------------------Create Module-----------------------------------------------
  async createModule(dto: CreateModuleDto, id: string): Promise<ApiResponse<Module>> {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      include: { instructor: true },
    });

    if (!existingCourse) throw new HttpException('Course not found', 404);
    if (!existingCourse?.instructor || existingCourse?.instructor.id !== id) throw new HttpException('You are not authorized for this course!', HttpStatus.BAD_GATEWAY);

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
  async findAll(params: any): Promise<ApiResponse<any>> {
    const data = await this.prisma.module.findMany({
      where: { courseId: params.courseId },
      include: {
        content: {
          select: {
            title: true,
            id: true,
            video: true,
            description: true,
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
  async findOne(params: IdDto): Promise<ApiResponse<Module>> {
    const module = await this.prisma.module.findUnique({
      where: { id: params.id },
      include: { content: true },
    });

    if (!module) {
      throw new HttpException('Module not found', 404);
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
            instructor: true
          }
        }
      },
    });

    if (!existingModule) throw new HttpException('Course not found', 404);
    if (!existingModule?.course?.instructor || existingModule?.course?.instructor.id !== id) throw new HttpException('You are not authorized for this course!', HttpStatus.BAD_GATEWAY);
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
  async remove(params: IdDto): Promise<ApiResponse<null>> {
    return this.prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({
        where: { id: params.id },
        include: {
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

      if (!module) {
        throw new HttpException('Module not found', 404);
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
