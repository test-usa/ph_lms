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
import { ContentService } from './content.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';
import { IdDto } from 'src/common/id.dto';
import sendResponse from 'src/utils/sendResponse';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @Post()
  async createContent(@Body() createContentDto: CreateContentDto, @Res() res: Response) {
    console.log(createContentDto)
    const result = await this.contentService.createContent(createContentDto);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Content created successfully',
      data: result,
    });
  }

  // @Get('moduleId/:id')
  // async findAll(@Param() id: IdDto, @Res() res:Response) {
  //   const result = await this.contentService.findAll(id);
  //   sendResponse(res, {
  //     statusCode: 200,
  //     success: true,
  //     message: 'Content retrieved successfully',
  //     data: result,
  //   });
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get content by ID' })
  // @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  // async findOne(@Param() id: IdDto, @Res() res: Response) {
  //   const result = await this.contentService.findOne(id);
  //   sendResponse(res, {
  //     statusCode: 200,
  //     success: true,
  //     message: 'Content retrieved successfully',
  //     data: result,
  //   });
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update content by ID' })
  // async update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @Res() res: Response) {
  //   const result = await this.contentService.update(id, updateContentDto);
  //   sendResponse(res, {
  //     statusCode: 200,
  //     success: true,
  //     message: 'Content updated successfully',
  //     data: result,
  //   });
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete content by ID' })
  // async remove(@Param('id') id: string, @Res() res: Response) {
  //   await this.contentService.remove(id);
  //   sendResponse(res, {
  //     statusCode: 200,
  //     success: true,
  //     message: 'Content deleted successfully',
  //     data: null,
  //   });
  // }
}
