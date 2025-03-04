import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Content, QuizInstance, Assignment, Prisma } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: DbService) {}

  //----------------------------------------Create Content--------------------------------------------
  async createContent(dto: CreateContentDto): Promise<Content> {
    try {
      // Check if module exists
      const moduleExists = await this.prisma.module.findUnique({
        where: { id: dto.moduleId },
      });

      if (!moduleExists) {
        throw new HttpException('Module not found',404);
      }

      return await this.prisma.content.create({
        data: {
          title: dto.title,
          video: dto.video,
          description: dto.description,
          moduleId: dto.moduleId,
          contentType:dto.contentType
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll({ id }: IdDto): Promise<ApiResponse<Content[]>> {
    try {
      const data = await this.prisma.content.findMany({
        where: { moduleId: id },
      });

      return {
        success: true,
        message: 'Contents retrieved successfully',
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne({ id }: IdDto): Promise<Content> {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!content) {
        throw new HttpException('Content not found',404);
      }

      return content;
    } catch (error) {
      throw error;
    }
  }

  // async update(id: string, dto: Partial<UpdateContentDto>): Promise<Content> {
  //   try {
  //     // Check if content exists
  //     const contentExists = await this.prisma.content.findUnique({
  //       where: { id },
  //     });

  //     if (!contentExists) {
  //       throw new NotFoundException('Content not found');
  //     }

  //     return await this.prisma.content.update({
  //       where: { id },
  //       data: { ...dto },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //----------------------------------------Delete Content--------------------------------------------
  async remove(id: string): Promise<ApiResponse<null>> {
    console.log(`Deleting content: ${id}`);

    try {
      const content = await this.prisma.content.findUnique({
        where: { id },
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
      });

      if (!content) {
        throw new HttpException('Content not found',404);
      }

      // Delete Quiz Submissions
      if (content.quiz) {
        await this.prisma.quizSubmission.deleteMany({
          where: { quizInstanceId: content.quiz.id },
        });

        // Delete Quizzes
        await this.prisma.quiz.deleteMany({
          where: { quizInstanceId: content.quiz.id },
        });

        // Delete QuizInstance
        await this.prisma.quizInstance.delete({
          where: { id: content.quiz.id },
        });
      }

      // Delete Assignment Submissions
      if (content.assignment) {
        await this.prisma.assignmentSubmission.deleteMany({
          where: { assignmentId: content.assignment.id },
        });

        // Delete Assignment
        await this.prisma.assignment.delete({
          where: { id: content.assignment.id },
        });
      }

      // Finally, delete the Content
      await this.prisma.content.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Content and associated data deleted successfully',
        statusCode: HttpStatus.OK,
        data: null,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error:', error);
      }
      throw error;
    }
  }
}
