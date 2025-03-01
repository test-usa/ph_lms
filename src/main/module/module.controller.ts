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

  /**
   * Create a New Module
   * 
   * This endpoint allows users with the appropriate role to create a new module.
   * @param dto - The data required to create the module.
   * @returns The newly created module data.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RoleGuardWith([UserRole.INSTRUCTOR]))
  async create(@Body() dto: CreateModuleDto) {
    console.log(dto)
    return this.moduleService.create(dto);
  }

  /**
   * Get All Modules for a Course
   * 
   * This endpoint fetches all modules for a specific course, based on the course ID.
   * @param id - The course ID to fetch modules for.
   * @returns A list of modules related to the given course ID.
   */
  @Get('course/:id')
  @ApiOperation({ summary: 'Get all modules' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async findAll(@Param() id: IdDto) {
    return this.moduleService.findAll(id);
  }

  /**
   * Get a Module by ID
   * 
   * This endpoint fetches a specific module based on its unique ID.
   * @param id - The module ID to retrieve.
   * @returns The module data corresponding to the given ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async findOne(@Param() id: IdDto) {
    return this.moduleService.findOne(id);
  }

  /**
   * Update a Module by ID
   * 
   * This endpoint allows users with the appropriate role to update a module's details.
   * @param id - The ID of the module to update.
   * @param dto - The data required to update the module.
   * @returns The updated module data.
   */
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

  /**
   * Delete a Module by ID
   * 
   * This endpoint allows users with the appropriate role to delete a module by its ID.
   * @param id - The ID of the module to delete.
   * @returns A success message indicating the module was deleted.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module by ID' })
  @ApiBearerAuth()
  @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  async remove(@Param() id: IdDto) {
    return this.moduleService.remove(id);
  }
}
