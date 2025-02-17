import { QuizService } from './quiz.service';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { TQuiz } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('getSingle')
  test(): string {
    return '<h1>Okay</h1>';
  }

  @Post('start')
  startQuizExam() {
    return this.quizService.startQuizExam();
  }

  @Post('submit')
  submitQuizExam(): string {A development Venetian. 
    return '<h1>Okay</h1>';
  }

  @Post('create')
  createQuizExam(@Body() quiz: TQuiz) {
    return this.quizService.createQuizExam(quiz);
  }

  @Post('update')
  updateQuizExam(): string {
    return '<h1>Update Quiz</h1>';
  }

  @Post('delete')
  deleteQuizExam(): string {
    return '<h1>Delete Quiz</h1>';
  }
}
