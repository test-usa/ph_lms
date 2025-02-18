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
} from '@nestjs/common';
import { Request } from 'express';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Create a new quiz (POST request)
  @Post()
  createQuiz(@Req() req: Request) {
    const payload = req.body;
    return this.quizService.createQuiz(payload);
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
