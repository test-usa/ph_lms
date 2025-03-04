// content.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateContentDto, UpdateContentDto } from './create-content.dto';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Content, Prisma } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: DbService) {}

  // Create Content
  async createContent(dto: CreateContentDto): Promise<Content> {
    try {
      const moduleExists = await this.prisma.module.findUnique({
        where: { id: dto.moduleId },
      });

      if (!moduleExists) {
        throw new HttpException('Module not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.content.create({
        data: {
          title: dto.title,
          video: dto.video,
          description: dto.description,
          moduleId: dto.moduleId,
          contentType: dto.contentType,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Find all Content
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

  // Find one Content
  async findOne({ id }: IdDto): Promise<Content> {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!content) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      return content;
    } catch (error) {
      throw error;
    }
  }

  // Update Content
  async updateContent(id: string, dto: UpdateContentDto): Promise<Content> {
    try {
      // Check if content exists
      const contentExists = await this.prisma.content.findUnique({
        where: { id },
      });

      if (!contentExists) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.content.update({
        where: { id },
        data: {
          title: dto.title,
          video: dto.video,
          description: dto.description,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Remove Content
  async remove(id: string): Promise<ApiResponse<null>> {
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
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      if (content.quiz) {
        await this.prisma.quizSubmission.deleteMany({
          where: { quizInstanceId: content.quiz.id },
        });

        await this.prisma.quiz.deleteMany({
          where: { quizInstanceId: content.quiz.id },
        });

        await this.prisma.quizInstance.delete({
          where: { id: content.quiz.id },
        });
      }

      if (content.assignment) {
        await this.prisma.assignmentSubmission.deleteMany({
          where: { assignmentId: content.assignment.id },
        });

        await this.prisma.assignment.delete({
          where: { id: content.assignment.id },
        });
      }

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
      throw error;
    }
  }
}
