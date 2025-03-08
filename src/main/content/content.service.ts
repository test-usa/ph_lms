// content.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateContentDto, UpdateContentDto } from './create-content.dto';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Content, UserRole } from '@prisma/client';
import { TUser } from 'src/interface/token.type';

@Injectable()
export class ContentService {
  constructor(private prisma: DbService) { }

  // Create Content
  async createContent(dto: CreateContentDto, userId: string): Promise<Content> {
    const existingModule = await this.prisma.module.findUnique({
      where: { id: dto.moduleId },
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
      where: { userId }
    })
    if (!existingModule) throw new HttpException('Module not found', HttpStatus.NOT_FOUND);
    if (!existingModule?.course?.instructor) throw new HttpException('You are not authorized for this content!', HttpStatus.BAD_GATEWAY);
    if (existingModule?.course?.instructor?.id !== instructor.id) throw new HttpException('You are not authorized for this content!', HttpStatus.BAD_GATEWAY);

    return await this.prisma.content.create({
      data: {
        title: dto.title,
        video: dto.video,
        description: dto.description,
        moduleId: dto.moduleId,
        contentType: dto.contentType,
      },
    });
  }

  // Find all Content
  async findAll({ id }: IdDto, user: TUser): Promise<ApiResponse<Content[]>> {
    const content = await this.prisma.content.findMany({
      where: { moduleId: id },
      include: {
        module: true
      }
    });

    if (content.length === 0) throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    if (user.role === 'INSTRUCTOR') {
      const instructor = await this.prisma.instructor.findUnique({
        where: { courseId: content[0].module.courseId }
      })
      if (!instructor) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }
    if (user.role === 'STUDENT') {
      const student = await this.prisma.student.findFirst({
        where: { courseId: content[0].module.courseId }
      })
      if (!student) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }

    return {
      success: true,
      message: 'Contents retrieved successfully',
      statusCode: HttpStatus.OK,
      data: content,
    };
  }

  // Find one Content
  async findOne({ id }: IdDto, user: TUser): Promise<Content> {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        module: true
      }
    });

    if (!content) throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    if (user.role === 'INSTRUCTOR') {
      const instructor = await this.prisma.instructor.findUnique({
        where: { courseId: content.module.courseId }
      })
      if (!instructor) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }
    if (user.role === 'STUDENT') {
      const student = await this.prisma.student.findFirst({
        where: { courseId: content.module.courseId }
      })
      if (!student) throw new HttpException('You are not authorized to view this course', HttpStatus
        .FORBIDDEN)
    }

    return content;
  }

  // Update Content
  async updateContent(id: string, user:any,dto: UpdateContentDto): Promise<Content> {
    const contentExists = await this.prisma.content.findUnique({
      where: { id },
      include: {
        module: {
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
          }
        }
      },
    });
    const instructor = await this.prisma.instructor.findUniqueOrThrow({
      where: { userId:user.id }
    })

    if (!contentExists) throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    if (!contentExists?.module?.course?.instructor) throw new HttpException('You are not authorized for this content!', HttpStatus.BAD_GATEWAY);
    if (contentExists?.module?.course?.instructor?.id !== instructor?.id) throw new HttpException('You are not authorized for this content!', HttpStatus.BAD_GATEWAY);

    return await this.prisma.content.update({
      where: { id },
      data: {
        title: dto.title,
        video: dto.video,
        description: dto.description,
      },
    });
  }

  // Remove Content
  async remove(id: string, user: TUser): Promise<ApiResponse<null>> {

    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        module: {
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
          }
        },
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

    const instructor = await this.prisma.instructor.findUniqueOrThrow({
      where: { userId: user.id }
    })

    if (!content) throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    if (user?.role == UserRole.INSTRUCTOR) {
      if (!content?.module?.course?.instructor) throw new HttpException('You are not authorized for this content!', HttpStatus.BAD_GATEWAY);
      if (content?.module?.course?.instructor?.id !== instructor.id) throw new HttpException('You are not authorized for this content!', HttpStatus.BAD_GATEWAY);
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
  }
}
