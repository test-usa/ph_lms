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
    try {
      return await this.quizService.createQuiz(createQuizDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create quizzes',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('start-quiz/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async startQuiz(@Param() id: IdDto) {
    try {
      return await this.quizService.startQuiz(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve quizzes',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('submit-quiz')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async submitQuiz(@Body() answer: SubmitAnswerDto, @Req() req) {
    try {
      return await this.quizService.submitQuiz(answer, req.user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to submit quiz',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete-quiz/:id')
  async deleteQuiz(@Param() id: IdDto) {
    try {
      return await this.quizService.deleteQuiz(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete quiz',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}