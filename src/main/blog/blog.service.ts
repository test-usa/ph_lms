import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateBlogDto } from './create-blog.dto';
import { UpdateBlogDto } from './update-blog.dto';
import { IdDto } from 'src/common/id.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: DbService) {}

  async create(createBlogDto: CreateBlogDto) {
    return this.prisma.blog.create({
      data: createBlogDto,
    });
  }

  async findAll() {
    return this.prisma.blog.findMany({
      include: { author: true },
    });
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return blog;
  }

  async update({id}: IdDto, updateBlogDto: UpdateBlogDto) {
    await this.findOne(id); // Ensure the blog exists

    return this.prisma.blog.update({
      where: { id },
      data: updateBlogDto,
    });
  }

  async remove({id}: IdDto) {
    await this.findOne(id); // Ensure the blog exists

    return this.prisma.blog.delete({
      where: { id },
    });
  }
}
