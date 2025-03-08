// content.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './create-content.dto';
import { IdDto } from 'src/common/id.dto';
import sendResponse from 'src/utils/sendResponse';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('create-content')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async create(@Body() createContentDto: CreateContentDto, @Res() res: Response, @Req() req: Request) {
    const result = await this.contentService.createContent(createContentDto, req.user.id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Content created successfully',
      data: result,
    });
  }

  @Get('moduleId/:id')
  @UseGuards(AuthGuard)
  async findAll(@Param() id: IdDto, @Res() res: Response, @Req() req: Request) {
    const result = await this.contentService.findAll(id, req.user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content retrieved successfully',
      data: result,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param() id: IdDto, @Res() res: Response,  @Req() req: Request) {
    const result = await this.contentService.findOne(id, req?.user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content retrieved successfully',
      data: result,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.contentService.updateContent(id,req.user, updateContentDto);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content updated successfully',
      data: result,
    });
  }

  @Delete('delete-content/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async remove(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    const result = await this.contentService.remove(id, req.user);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Content and associated data deleted successfully',
      data: result,
    });
  }
}
