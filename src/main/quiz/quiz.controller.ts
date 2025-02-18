import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
  Res,
  Patch,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './quiz.dto';
import sendResponse from 'src/utils/sendResponse';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Create a new quiz (POST request)
  @Post()
  async createQuiz(@Body() createQuizDto: CreateQuizDto, @Res() res: Response) {
    const result = await this.quizService.createQuiz(createQuizDto);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Quiz created successfully',
      data: result,
    });
  }

  // Update an existing quiz (PUT request)
  @Patch(':id')
  updateQuiz(@Param('id') id: string, @Req() req: Request) {
    return this.quizService.updateQuiz(id, req.body);
  }

  // Delete a quiz (DELETE request)
  @Delete(':id')
  deleteQuiz(@Param('id') id: string) {
    return this.quizService.deleteQuiz(id);
  }
}
