import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './quiz.Dto';
import sendResponse from 'src/utils/sendResponse';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // ✅ Create a new quiz (POST request)
  @Post()
  @HttpCode(201) // Setting correct HTTP code for creation
  async createQuiz(@Body() createQuizDto: CreateQuizDto, @Res() res: Response) {
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
