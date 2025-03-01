import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizDto, SubmitAnswerDto, UpdateQuizDto } from './quiz.Dto';
import { DbService } from 'src/db/db.service';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Quiz, QuizInstance } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(private readonly db: DbService) {}

  private async getQuizInstanceOrCreate(contentId: string, totalMark: number) {
    let quizInstance = await this.db.quizInstance.findUnique({
      where: { contentId },
    });

    if (!quizInstance) {
      quizInstance = await this.db.quizInstance.create({
        data: {
          contentId,
          totalMark,
        },
      });
    }

    return quizInstance;
  }

  public async createQuiz({
    contentId,
    totalMark,
    quizesData,
  }: CreateQuizDto): Promise<ApiResponse<Quiz[]>> {
    const quizInstance = await this.getQuizInstanceOrCreate(contentId, totalMark);

    const newQuizzes = await Promise.all(
      quizesData.map(async (quiz) =>
        this.db.quiz.create({
          data: {
            question: quiz.question,
            options: quiz.options,
            correctAnswer: quiz.correctAnswer,
            quizInstanceId: quizInstance.id,
          },
        })
      )
    );

    return {
      data: newQuizzes,
      success: true,
      message: 'Quizzes created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  public async submitQuiz({
    answerSheet,
    quizInstanceId,
  }: SubmitAnswerDto): Promise<ApiResponse<QuizInstance>> {
    const quizInstance = await this.db.quizInstance.findUnique({
      where: { id: quizInstanceId },
      include: { quiz: true },
    });

    if (!quizInstance) {
      throw new HttpException('Quiz instance not found', HttpStatus.NOT_FOUND);
    }

    let acquiredMark = 0;

    for (const quiz of quizInstance.quiz) {
      const userAnswer = answerSheet.find((ans) => ans.quizId === quiz.id);
      if (userAnswer && userAnswer.answer === quiz.correctAnswer) {
        acquiredMark++;
      }
    }

    return {
      data: null,
      success: true,
      message: `Quiz submitted successfully. Score: ${acquiredMark}/${quizInstance.quiz.length}`,
      statusCode: HttpStatus.OK,
    };
  }
}
