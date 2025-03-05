import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { CreateModuleDto } from './module.dto';

@Controller('module')
@UseGuards(AuthGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR]))
  async createModule(@Body() dto: CreateModuleDto) {
    return this.moduleService.createModule(dto);
  }

  @Get(':courseId')
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async findAll(@Param() params: any) {
    return this.moduleService.findAll(params);
  }

  @Get('single/:id')
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async findOne(@Param() params: IdDto) {
    return this.moduleService.findOne(params);
  }

  @Patch(':id')
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN]))
  async updateModuleTitle(@Param() params: IdDto, @Body('title') title: string) {
    return this.moduleService.updateModuleTitle(params, title);
  }

  @Delete(':id')
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN]))
  async remove(@Param() params: IdDto) {
    return this.moduleService.remove(params);
  }
}
