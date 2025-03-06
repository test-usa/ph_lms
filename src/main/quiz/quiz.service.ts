import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizDto, SubmitAnswerDto } from './quiz.Dto';
import { DbService } from 'src/db/db.service';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Quiz, QuizInstance, QuizSubmission } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(private readonly db: DbService) { }

  //------------------------------Get Quiz instance or Create------------------------------
  private async getQuizInstanceOrCreate(contentId: string, totalMark: number) {
    let content = await this.db.content.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      throw new HttpException('Content not found', 404);
    }

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

  // ------------------------------Create A Quiz----------------------------------------
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

  // ------------------------------Start Quiz-------------------------------------
  public async startQuiz({ id }: IdDto): Promise<ApiResponse<Partial<Quiz>[]>> {
    const quizContent = await this.db.content.findUnique({
      where: { id },
      include: {
        quiz: {
          include: {
            quiz: {
              select: {
                id: true,
                question: true,
                options: true,
              },
            }
          },
        },
      },
    });

    if (!quizContent?.quiz || !quizContent?.quiz.quiz.length) {
      throw new HttpException('No quizzes found!', HttpStatus.NOT_FOUND);
    }

    return {
      data: quizContent.quiz.quiz,
      success: true,
      message: 'Quizzes retrieved successfully',
      statusCode: HttpStatus.OK,
    };
  }


  //----------------------------------Submit Quiz-------------------------------------------
  public async submitQuiz(
    { answerSheet, quizInstanceId }: SubmitAnswerDto,
    uid: string,
  ): Promise<ApiResponse<QuizSubmission>> {
    const studentExists = await this.db.student.findUnique({
      where: { userId: uid },
    });

    if (!studentExists) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    const quizInstance = await this.db.quizInstance.findUnique({
      where: { id: quizInstanceId },
      include: { quiz: true },
    });

    if (!quizInstance) {
      throw new HttpException('Quiz instance not found', HttpStatus.NOT_FOUND);
    }

    const existingSubmission = await this.db.quizSubmission.findFirst({
      where: { quizInstanceId, studentId: studentExists.id },
    });

    if (existingSubmission) {
      throw new HttpException('Quiz already submitted', HttpStatus.BAD_REQUEST);
    }

    let correctAnswers = 0;
    let incorrectAnswers = 0;

    for (const quiz of quizInstance.quiz) {
      const userAnswer = answerSheet.find((ans) => ans.quizId === quiz.id);
      if (userAnswer) {
        if (userAnswer.answer === quiz.correctAnswer) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    }

    const quizSubmission = await this.db.quizSubmission.create({
      data: {
        quizInstanceId,
        studentId: studentExists.id,
        correctAnswers,
        incorrectAnswers,
        isCompleted: true,
      },
    });

    return {
      data: quizSubmission,
      success: true,
      message: `Quiz submitted successfully. Score: ${correctAnswers}/${quizInstance.quiz.length}`,
      statusCode: HttpStatus.OK,
    };
  }

  // ------------------------------Delete Single Quiz-------------------------------------
  public async deleteQuiz({ id }: IdDto): Promise<ApiResponse<null>> {
    // Check if the quiz exists
    const quiz = await this.db.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
    }

    // Delete the quiz
    await this.db.quiz.delete({
      where: { id },
    });

    return {
      data: null,
      success: true,
      message: 'Quiz deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}