import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizDto, SubmitAnswerDto, UpdateQuizDto } from './quiz.Dto';
import { DbService } from 'src/db/db.service';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Quiz, QuizInstance } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(
    private readonly db: DbService
  ) { }

  private async getQuizInstanceOrCreate(contentId: string) {
    const quizInstance = await this.db.quizInstance.findUnique({
      where: { contentId },
    });

    if (!quizInstance) {
      return this.db.quizInstance.create({
        data: {
          contentId,
          acquiredMark: 0,
          totalMark: 0,
        },
        include: {
          quiz: true
        }
      });
    }

    return quizInstance;
  }

  public async createQuiz({
    contentId,
    question,
    options,
    correctAnswer,
  }: CreateQuizDto): Promise<ApiResponse<Quiz>> {
    const quizInstance = await this.getQuizInstanceOrCreate(contentId);

    const newQuiz = await this.db.quiz.create({
      data: {
        question,
        options,
        correctAnswer,
        quizInstanceId: quizInstance.id,
      },
    });

    return {
      data: newQuiz,
      success: true,
      message: 'Quiz created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  public async deleteQuiz({
    id
  }: IdDto) {
    return this.db.quiz.delete({
      where: { id },
    });
  }

  public async updateQuiz({
    id,
    question,
    options,
    correctAnswer,
  }: UpdateQuizDto): Promise<ApiResponse<Quiz>> {
    const updated = await this.db.quiz.update({
      where: { id },
      data: {
        question,
        options,
        correctAnswer,
      },
    });
    return {
      data: updated,
      success: true,
      message: 'Quiz updated successfully',
      statusCode: HttpStatus.OK,
    }
  }

  public async getAllQuizzes({ id: quizInstanceId }: IdDto): Promise<ApiResponse<Partial<Quiz>[]>> {
    if (quizInstanceId === undefined) throw new HttpException('No quiz instance id found', HttpStatus.BAD_REQUEST)

    const quizInstance = await this.db.quiz.findMany({
      where: { quizInstanceId },
      select: {
        id: true,
        question: true,
        options: true,
      }
    });

    return {
      data: quizInstance,
      success: true,
      message: 'Quizzes fetched successfully',
      statusCode: HttpStatus.OK,
    }
  }

  public async submitQuiz({
    answerSheet,
    quizInstanceId
  }: SubmitAnswerDto): Promise<ApiResponse<QuizInstance>> {
    if (quizInstanceId === undefined) throw new HttpException('No quiz instance id found', HttpStatus.BAD_REQUEST)

    const quizInstance = await this.db.quizInstance.findUnique({
      where: { id: quizInstanceId },
      include: {
        quiz: true
      },
    });

    if (!quizInstance) throw new HttpException('Quiz instance not found', HttpStatus.NOT_FOUND)

    let acquiredMark = 0

    await quizInstance.quiz.forEach(e => {
      const userAnswerIndex = answerSheet.findIndex(a => a.quizId === e.id);
      if (userAnswerIndex !== -1) {
        acquiredMark += e.correctAnswer === e.correctAnswer ? 1 : 0;
      }
    })

    const updated = await this.db.quizInstance.update({
      where: { id: quizInstanceId },
      data: {
        acquiredMark,
        totalMark: quizInstance.quiz.length,
      },
    })
    return {
      data: updated,
      success: true,
      message: 'Quiz submitted successfully',
      statusCode: HttpStatus.OK,
    }
  }
}
