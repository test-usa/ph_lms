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

  // @Post()
  // @ApiOperation({ summary: 'Create a new blog' })
  // @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN ,UserRole.INSTRUCTOR]))
  // create(@Body() createBlogDto: CreateBlogDto) {
  //   return this.blogService.create(createBlogDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]))
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get a single blog' })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]))
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Update a blog' })
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTRUCTOR]))
  update(@Param('id') id: IdDto, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @ApiOperation({ summary: 'Delete a blog' })
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTRUCTOR]))
  remove(@Param('id') id: IdDto) {
    return this.blogService.remove(id);
  }
}
