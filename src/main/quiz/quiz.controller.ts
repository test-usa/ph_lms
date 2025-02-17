import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('getSingle')
  test(@Req() req: Request, @Res() res: Response): string {
    return '<h1>Okay</h1>';
  }
  @Post('start/:id')
  startQuizExam(@Param() params: any) {
    return this.quizService.startQuizExam(params.id);
  }
  @Post('submit')
  submitQuizExam(@Req() req: Request, @Res() res: Response): string {
    return '<h1>Okay</h1>';
  }
  @Post('create')
  createQuizExam(@Req() req: Request) {
    const payload = req.body;
    return this.quizService.createQuizExam(payload);
  }
  @Post('create')
  updateQuizExam(@Req() req: Request, @Res() res: Response): string {
    return '<h1>Okay</h1>';
  }
  @Post('create')
  deleteQuizExam(@Req() req: Request, @Res() res: Response): string {
    return '<h1>Okay</h1>';
  }
}

// import { QuizService } from './quiz.service';
// import { Controller, Get, Post, Body } from '@nestjs/common';
// import { TQuiz } from './quiz.service';

// @Controller('quiz')
// export class QuizController {
//   constructor(private readonly quizService: QuizService) {}

//   @Get('getSingle')
//   test(): string {
//     return '<h1>Okay</h1>';
//   }

//   @Get('start')
//   startQuizExam() {
//     return this.quizService.startQuizExam();
//   }

//   @Post('submit')
//   submitQuizExam(): string {
//     return '<h1>Okay</h1>';
//   }

//   @Post('create')
//   createQuizExam(@Body() quiz: TQuiz) {
//     return this.quizService.createQuizExam(quiz);
//   }

//   @Post('update')
//   updateQuizExam(): string {
//     return '<h1>Update Quiz</h1>';
//   }

//   @Post('delete')
//   deleteQuizExam(): string {
//     return '<h1>Delete Quiz</h1>';
//   }
// }
