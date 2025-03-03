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
import { ContentService } from './content.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';
import { IdDto } from 'src/common/id.dto';
import sendResponse from 'src/utils/sendResponse';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('create-content')
   @ApiBearerAuth()
   @UseGuards(
     AuthGuard,
     RoleGuardWith([UserRole.INSTRUCTOR]),
   )
  async create(@Body() createContentDto: CreateContentDto, @Res() res: Response) {
    const result = await this.contentService.create(createContentDto);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Content created successfully',
      data: result,
    });
  }

  @Get('moduleId/:id')
  @ApiOperation({ summary: 'Get all content' })
  //@ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  async findAll(@Param() id: IdDto, @Res() res:Response) {
    const result = await this.contentService.findAll(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content retrieved successfully',
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  async findOne(@Param() id: IdDto, @Res() res: Response) {
    const result = await this.contentService.findOne(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content by ID' })
  async update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @Res() res: Response) {
    const result = await this.contentService.update(id, updateContentDto);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content updated successfully',
      data: result,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content by ID' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.contentService.remove(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content deleted successfully',
      data: null,
    });
  }
}
