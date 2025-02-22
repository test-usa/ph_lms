import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './quiz.Dto';
import sendResponse from 'src/utils/sendResponse';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // ✅ Create a new quiz (POST request)
  @Post()
  @HttpCode(201) // Setting correct HTTP code for creation
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR]))
  async createQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(req.headers.authorization);
    const result = await this.quizService.createQuiz(createQuizDto);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Quiz created successfully',
      data: result,
    });
  }

  // ✅ Update an existing quiz (PATCH request)
  @Patch(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.ADMIN]))
  async updateQuiz(
    @Param('id') id: string,
    @Body() createQuizDto: CreateQuizDto,
    @Res() res: Response,
  ) {
    const result = await this.quizService.updateQuiz(id, createQuizDto); // Ensure await is used
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Quiz updated successfully',
      data: result,
    });
  }

  // ✅ Delete a quiz (DELETE request)
  @Delete(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.ADMIN, UserRole.INSTRUCTOR]))
  async deleteQuiz(@Param('id') id: string, @Res() res: Response) {
    await this.quizService.deleteQuiz(id);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Quiz deleted successfully',
      data: null,
    });
  }
}
