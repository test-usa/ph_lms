import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ModuleService } from './module.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';
import { UpdateModuleDto } from './update-module.dto';
import sendResponse from 'src/utils/sendResponse';

@ApiTags('Modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  async create(@Body() dto: CreateModuleDto, @Res() res: Response) {
    const result = await this.moduleService.create(dto);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Module created successfully',
      data: result,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  async findAll(@Res() res: Response) {
    const result = await this.moduleService.findAll();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Modules retrieved successfully',
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.moduleService.findOne(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Module retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module by ID' })

  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto, @Res() res: Response) {
    const result = await this.moduleService.update(id, dto);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Module updated successfully',
      data: result,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module by ID' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.moduleService.remove(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Module deleted successfully',
      data: null,
    });
  }
}
