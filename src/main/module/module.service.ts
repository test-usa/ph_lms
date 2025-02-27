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

  /**
   * Create Module
   * 
   * Creates a new module for a course, ensuring the course exists before adding the module.
   * @param dto - The data required to create the module.
   * @returns The created module data with a success message.
   */
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

  /**
   * Get All Modules for a Course
   * 
   * Retrieves all modules for a specific course, including related content.
   * @param id - The ID of the course to fetch modules for.
   * @returns A list of modules with related content for the specified course.
   */
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
              select: {
                id: true,
              },
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

  /**
   * Get One Module by ID
   * 
   * Retrieves a single module by its ID, including the content related to the module.
   * @param id - The ID of the module to retrieve.
   * @returns The module data along with its content.
   */
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

  /**
   * Update Module
   * 
   * Updates the details of an existing module.
   * @param id - The ID of the module to update.
   * @param dto - The data required to update the module.
   * @returns The updated module data with a success message.
   */
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

  /**
   * Remove Module
   * 
   * Deletes an existing module.
   * @param id - The ID of the module to delete.
   * @returns The result of the delete operation with a success message.
   */
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
