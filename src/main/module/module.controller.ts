import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { CreateModuleDto } from './module.dto';
import { Request } from 'express';

@Controller('module')
@UseGuards(AuthGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async createModule(@Body() dto: CreateModuleDto, @Req() req: Request,) {
    return this.moduleService.createModule(dto, req.user.id);
  }

  @Get(':courseId')
  @UseGuards(AuthGuard)
  async findAll(@Param() params: any) {
    return this.moduleService.findAll(params);
  }

  @Get('single/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param() params: IdDto) {
    return this.moduleService.findOne(params);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async updateModuleTitle(@Param() params: IdDto, @Req() req: Request, @Body('title') title: string) {
    return this.moduleService.updateModuleTitle(params, title, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN]))
  async remove(@Param() params: IdDto) {
    return this.moduleService.remove(params);
  }
}
