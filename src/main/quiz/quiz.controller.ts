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
  Get,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { QuizService } from './quiz.service';
import { CreateQuizDto, SubmitAnswerDto, UpdateQuizDto } from './quiz.Dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // ✅ Create a new quiz (POST request)
  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async createQuiz(
    @Body() createQuizDto: CreateQuizDto,
  ) {
    return this.quizService.createQuiz(createQuizDto)
  }

  // ✅ Update an existing quiz (PATCH request)
  @Patch('update')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async updateQuiz(
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizService.updateQuiz(updateQuizDto)
  }

  // ✅ Delete a quiz (DELETE request)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]))
  async deleteQuiz(@Param() id: IdDto) {
    return this.quizService.deleteQuiz(id)
  }

  @Get('startQuiz/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([ UserRole.STUDENT]))
  async getAllQuizzes(@Param() id:IdDto) {
    return this.quizService.getAllQuizzes(id)
  }

  @Post('submitQuiz')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([ UserRole.STUDENT]))
  async submitQuiz(
    @Body() answer: SubmitAnswerDto 
  ) {

  }
}
