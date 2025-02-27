import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateModuleDto } from './create-module.dto';
import { UpdateModuleDto } from './update-module.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Content, Module } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: DbService) {}

  async create(dto: CreateModuleDto): Promise<ApiResponse<Module>> {
    // Check if course exists before adding a module
    if (dto.courseId) {
      const courseExists = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });

      if (!courseExists) {
        throw new NotFoundException('Course not found');
      }
    }

    const data = await this.prisma.module.create({
      data: { ...dto },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Module created successfully',
      data,
    };
  }

  async findAll({
    id,
  }: IdDto): Promise<ApiResponse<any>> {
    const data = await this.prisma.module.findMany({
      where: { courseId: id }, // Filter by course ID
      include: {
        content: {
          select: {
            title: true,
            id: true,
            video: true,
            description: true,
            QuizInstance: {
            select:{
              id: true,
            }
            },
          },
        },
      }, // Include related content
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Modules retrieved successfully',
      data,
    };
  }

  async findOne({
    id,
  }: IdDto): Promise<ApiResponse<Module & { content: Content[] }>> {
    const module = await this.prisma.module.findUnique({
      where: { id },
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

  async update(id: IdDto, dto: UpdateModuleDto): Promise<ApiResponse<Module>> {
    // Ensure module exists before updating
    const data = await this.prisma.module.update({
      where: id,
      data: { ...dto },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Module updated successfully',
      data,
    };
  }

  async remove(id: IdDto): Promise<ApiResponse<Module>> {
    // Ensure module exists before deleting
    const data = await this.prisma.module.delete({ where: id });
    return {
      statusCode: 200,
      success: true,
      message: 'Module deleted successfully',
      data,
    };
  }
}
