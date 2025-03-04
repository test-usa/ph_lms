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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';

@ApiTags('Quiz') // Group all quiz-related endpoints under the "Quiz" tag in Swagger
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Quizzes created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quizzes retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No quizzes found for this instance',
  })
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz submitted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student or quiz instance not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Quiz already submitted',
  })
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
  @ApiBearerAuth()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quiz deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quiz not found',
  })
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