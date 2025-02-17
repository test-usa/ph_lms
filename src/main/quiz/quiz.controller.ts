import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Create a new quiz (POST request)
  @Post('create')
  createQuiz(@Req() req: Request) {
    const payload = req.body;
    return this.quizService.createQuiz(payload);
  }

  // Update an existing quiz (PUT request)
  @Put('update/:id')
  updateQuiz(@Param('id') id: string, @Req() req: Request) {
    return this.quizService.updateQuiz(id, req.body);
  }

  // Delete a quiz (DELETE request)
  @Delete('delete/:id')
  deleteQuiz(@Param('id') id: string) {
    return this.quizService.deleteQuiz(id);
  }
}
