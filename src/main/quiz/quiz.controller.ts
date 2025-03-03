import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Get,
  Request,
  Req,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, SubmitAnswerDto, UpdateQuizDto } from './quiz.Dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}


  @Post('create')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }


  // @Patch('update')
  // @UseGuards(
  //   AuthGuard,
  //   RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  // )
  // async updateQuiz(@Body() updateQuizDto: UpdateQuizDto) {
  //   return this.quizService.updateQuiz(updateQuizDto);
  // }


  // @Delete('delete/:id')
  // @ApiBearerAuth()
  // @UseGuards(
  //   AuthGuard,
  //   RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  // )
  // async deleteQuiz(@Param() id: IdDto) {
  //   return this.quizService.deleteQuiz(id);
  // }


  @Get('startQuiz/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async startQuiz(@Param() id: IdDto) {
    return this.quizService.startQuiz(id);
  }

  @Post('submitQuiz')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async submitQuiz(@Body() answer: SubmitAnswerDto, @Req() req) {
    return this.quizService.submitQuiz(answer,req.user.id);
  }
}
