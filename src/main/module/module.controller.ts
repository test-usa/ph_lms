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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';
import { UpdateModuleDto } from './update-module.dto';
import { IdDto } from 'src/common/id.dto';

@ApiTags('Modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  async create(@Body() dto: CreateModuleDto) {
    return this.moduleService.create(dto);
  }

  @Get('course/:id')
  @ApiOperation({ summary: 'Get all modules' })
  async findAll(@Res() res: Response, @Param() id: IdDto) {
    return this.moduleService.findAll(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  async findOne(@Param() id: IdDto, @Res() res: Response) {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module by ID' })
  async update(
    @Param() id: IdDto,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module by ID' })
  async remove(@Param() id: IdDto,) {
    return this.moduleService.remove(id);
  }
}
