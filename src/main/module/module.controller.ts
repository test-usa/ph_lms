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
import { CreateModuleDto } from './create-module.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@Controller('module')
@UseGuards(AuthGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) { }

  @Post()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async createModule(@Body() dto: CreateModuleDto) {
    console.log(dto)
    return this.moduleService.createModule(dto);
  }


  // @Get('course/:id')
  // @ApiOperation({ summary: 'Get all modules' })
  // @ApiBearerAuth()
  // @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  // async findAll(@Param() id: IdDto) {
  //   return this.moduleService.findAll(id);
  // }


  // @Get(':id')
  // @ApiOperation({ summary: 'Get a module by ID' })
  // @ApiBearerAuth()
  // @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  // async findOne(@Param() id: IdDto) {
  //   return this.moduleService.findOne(id);
  // }


  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a module by ID' })
  // @ApiBearerAuth()
  // @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  // async update(
  //   @Param() id: IdDto,
  //   @Body() dto: UpdateModuleDto,
  // ) {
  //   return this.moduleService.update(id, dto);
  // }


  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a module by ID' })
  // @ApiBearerAuth()
  // @UseGuards(RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.STUDENT]))
  // async remove(@Param() id: IdDto) {
  //   return this.moduleService.remove(id);
  // }
}
