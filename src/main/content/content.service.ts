import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Content, QuizInstance } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: DbService) {}

  //----------------------------------------Create Content--------------------------------------------
  async createContent(dto: CreateContentDto) {
    // Check if module exists
    const moduleExists = await this.prisma.module.findUnique({
      where: { id: dto.moduleId },
    });

    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    return this.prisma.content.create({
      data: {
        title: dto.title,
        video: dto.video,
        description: dto.description,
        moduleId: dto.moduleId,
      },
    });
  }

  // async findAll({ id }: IdDto): Promise<ApiResponse<Content[]>> {
  //   const data = await this.prisma.content.findMany({
  //     where: {
  //       moduleId: id,
  //     },
  //   });
  //   return {
  //     success: true,
  //     message: 'Contents retrieved successfully',
  //     statusCode: HttpStatus.OK,
  //     data,
  //   };
  // }

  // async findOne({ id }: IdDto) {
  //   const content = await this.prisma.content.findUnique({
  //     where: { id },
  //   });

  //   if (!content) {
  //     throw new NotFoundException('Content not found');
  //   }

  //   return content;
  // }

  // async update(id: string, dto: UpdateContentDto) {
  //   // Check if content exists
  //   const contentExists = await this.prisma.content.findUnique({
  //     where: { id },
  //   });

  //   if (!contentExists) {
  //     throw new NotFoundException('Content not found');
  //   }

  //   // return this.prisma.content.update({
  //   //   where: { id },
  //   //   data: { ...dto },
  //   // });
  // }

  // async remove(id: string) {
  //   // Check if content exists
  //   const contentExists = await this.prisma.content.findUnique({
  //     where: { id },
  //   });

  //   if (!contentExists) {
  //     throw new NotFoundException('Content not found');
  //   }

  //   return this.prisma.content.delete({ where: { id } });
  // }
}
