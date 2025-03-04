import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateModuleDto } from './create-module.dto';
import { UpdateModuleDto } from './update-module.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Module } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: DbService) {}

  //----------------------------------------Create Module-----------------------------------------------
  async createModule(dto: CreateModuleDto): Promise<ApiResponse<Module>> {
    if (dto.courseId) {
      const courseExists = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });

      if (!courseExists) {
        throw new NotFoundException('Course not found');
      }
    }

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
      throw new NotFoundException('Module not found');
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Module retrieved successfully',
      data: module,
    };
  }

  //----------------------------------------Update Module----------------------------------------------
  async update(params: IdDto, dto: UpdateModuleDto): Promise<ApiResponse<Module>> {
    const data = await this.prisma.module.update({
      where: { id: params.id },
      data: { ...dto },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Module updated successfully',
      data,
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
              quizInstance: {
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
        throw new NotFoundException('Module not found');
      }

      for (const content of module.content) {
        if (content.quizInstance) {
          await tx.quizSubmission.deleteMany({
            where: { quizInstanceId: content.quizInstance.id },
          });
          await tx.quiz.deleteMany({
            where: { quizInstanceId: content.quizInstance.id },
          });
          await tx.quizInstance.delete({
            where: { id: content.quizInstance.id },
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
