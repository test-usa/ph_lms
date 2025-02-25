import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ModuleService } from './module.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';
import { UpdateModuleDto } from './update-module.dto';
import { IdDto } from 'src/common/id.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@ApiTags('Modules')
@Controller('modules')
@UseGuards(AuthGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async create(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @Get('course/:id')
  @ApiOperation({ summary: 'Get all modules' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async findAll(@Param() id: IdDto) {
    return this.moduleService.findAll(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async findOne(@Param() id: IdDto) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module by ID' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async update(
    @Param() id: IdDto,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module by ID' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async remove(@Param() id: IdDto,) {
    return this.moduleService.remove(id);
  }
}
