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
  async createModule(@Body() dto: CreateModuleDto, @Req() req: Request) {
    return this.moduleService.createModule(dto, req.user.id);
  }

  @Get(':courseId')
  @UseGuards(AuthGuard)
  async findAll(@Param() params: any, @Req() req: Request) {
    return this.moduleService.findAll(params, req.user);
  }

  @Get('single/:id')
  @UseGuards(AuthGuard)
  async findOne(@Param() params: IdDto, @Req() req: Request) {
    return this.moduleService.findOne(params, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async updateModuleTitle(@Param() params: IdDto, @Req() req: Request, @Body('title') title: string) {
    return this.moduleService.updateModuleTitle(params, title, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async remove(@Param() params: IdDto, @Req() req: Request) {
    return this.moduleService.remove(params, req.user);
  }
}
