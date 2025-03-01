import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Get,
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

  /**
   * Create Quiz
   * 
   * Endpoint to create a new quiz. Only accessible by instructors, admins, and super admins.
   * @param createQuizDto - The data required to create the quiz.
   * @returns The created quiz data.
   */
  @Post('create')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }

  /**
   * Update Quiz
   * 
   * Endpoint to update an existing quiz. Only accessible by instructors, admins, and super admins.
   * @param updateQuizDto - The data required to update the quiz.
   * @returns The updated quiz data.
   */
  @Patch('update')
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  async updateQuiz(@Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.updateQuiz(updateQuizDto);
  }

  /**
   * Delete Quiz
   * 
   * Endpoint to delete an existing quiz. Only accessible by instructors, admins, and super admins.
   * @param id - The ID of the quiz to delete.
   * @returns The result of the delete operation.
   */
  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  async deleteQuiz(@Param() id: IdDto) {
    return this.quizService.deleteQuiz(id);
  }

  /**
   * Get All Quizzes for a Quiz Instance
   * 
   * Endpoint to get all quizzes for a particular quiz instance. Only accessible by students.
   * @param id - The ID of the quiz instance to fetch quizzes for.
   * @returns The list of quizzes for the specified quiz instance.
   */
  @Get('startQuiz/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async getAllQuizzes(@Param() id: IdDto) {
    return this.quizService.getAllQuizzes(id);
  }

  /**
   * Submit Quiz
   * 
   * Endpoint to submit answers for a quiz. Only accessible by students.
   * @param answer - The answer sheet for the quiz submission.
   * @returns The result of the quiz submission.
   */
  @Post('submitQuiz')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async submitQuiz(@Body() answer: SubmitAnswerDto) {
    return this.quizService.submitQuiz(answer);
  }
}
