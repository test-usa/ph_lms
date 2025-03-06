import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Get,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, SubmitAnswerDto } from './quiz.Dto';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
      return await this.quizService.createQuiz(createQuizDto);
  }

  @Get('start-quiz/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async startQuiz(@Param() id: IdDto) {
      return await this.quizService.startQuiz(id);
  }

  @Post('submit-quiz')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async submitQuiz(@Body() answer: SubmitAnswerDto, @Req() req) {
      return await this.quizService.submitQuiz(answer, req.user.id);
  }

  @Delete('delete-quiz/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteQuiz(@Param() id: IdDto) {
      return await this.quizService.deleteQuiz(id);
  }
}