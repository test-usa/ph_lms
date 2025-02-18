import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';
import { UpdateModuleDto } from './update-module.dto';

@ApiTags('Modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  create(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: 200, description: 'Modules retrieved successfully' })
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  @ApiResponse({ status: 200, description: 'Module retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module by ID' })
  @ApiResponse({ status: 200, description: 'Module updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module by ID' })
  @ApiResponse({ status: 200, description: 'Module deleted successfully' })
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }
}
