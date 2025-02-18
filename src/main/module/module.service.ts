import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateModuleDto } from './create-module.dto';
import { UpdateModuleDto } from './update-module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: DbService) {}

  async create(dto: CreateModuleDto) {
    // Check if course exists before adding a module
    if (dto.courseId) {
      const courseExists = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });

      if (!courseExists) {
        throw new NotFoundException('Course not found');
      }
    }

    return this.prisma.module.create({
      data: { ...dto },
    });
  }

  async findAll() {
    return this.prisma.module.findMany({
      include: { content: true }, // Include related content
    });
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: { content: true },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }

  async update(id: string, dto: UpdateModuleDto) {
    // Ensure module exists before updating
    await this.findOne(id);

    return this.prisma.module.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    // Ensure module exists before deleting
    await this.findOne(id);

    return this.prisma.module.delete({ where: { id } });
  }
}
