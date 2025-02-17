import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateContentDto } from './dto/create-content.dto';
// import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: DbService) {}

  async create(dto: CreateContentDto) {
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
        assignment: dto.assignment,
        moduleId: dto.moduleId,
      },
    });
  }

  async findAll() {
    return this.prisma.content.findMany({
      include: { quiz: true },
    });
  }

  async findOne(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: { quiz: true },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async update(id: string, dto: UpdateContentDto) {
    // Check if content exists
    const contentExists = await this.prisma.content.findUnique({
      where: { id },
    });

    if (!contentExists) {
      throw new NotFoundException('Content not found');
    }

    return this.prisma.content.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    // Check if content exists
    const contentExists = await this.prisma.content.findUnique({
      where: { id },
    });

    if (!contentExists) {
      throw new NotFoundException('Content not found');
    }

    return this.prisma.content.delete({ where: { id } });
  }
}
