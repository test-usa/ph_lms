import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './create-blog.dto';
import { UpdateBlogDto } from './update-blog.dto';
import { IdDto } from 'src/common/id.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';


@ApiTags('Blog')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog' })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN ,UserRole.INSTRUCTOR]))
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @ApiOperation({ summary: 'Get all blogs' })
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @ApiOperation({ summary: 'Get a single blog' })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a blog' })
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  update(@Param('id') id: IdDto, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @ApiOperation({ summary: 'Delete a blog' })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  remove(@Param('id') id: IdDto) {
    return this.blogService.remove(id);
  }
}
