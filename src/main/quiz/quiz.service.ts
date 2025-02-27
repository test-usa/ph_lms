import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuizDto, SubmitAnswerDto, UpdateQuizDto } from './quiz.Dto';
import { DbService } from 'src/db/db.service';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Quiz, QuizInstance } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(private readonly db: DbService) {}

  /**
   * Get or Create Quiz Instance
   * 
   * Retrieves an existing quiz instance or creates a new one if none exists for the given contentId.
   * @param contentId - The ID of the content associated with the quiz.
   * @returns The quiz instance.
   */
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
          quiz: true,
        },
      });
    }

    return quizInstance;
  }

  /**
   * Create Quiz
   * 
   * Creates a new quiz for the specified content with the provided question, options, and correct answer.
   * @param createQuizDto - The data required to create the quiz.
   * @returns The created quiz and a success message.
   */
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

  /**
   * Delete Quiz
   * 
   * Deletes the specified quiz from the database.
   * @param idDto - The ID of the quiz to delete.
   * @returns The result of the delete operation.
   */
  public async deleteQuiz({ id }: IdDto) {
    return this.db.quiz.delete({
      where: { id },
    });
  }

  /**
   * Update Quiz
   * 
   * Updates the details of an existing quiz based on the provided data.
   * @param updateQuizDto - The data required to update the quiz.
   * @returns The updated quiz and a success message.
   */
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
    };
  }

  /**
   * Get All Quizzes
   * 
   * Fetches all quizzes for the given quiz instance.
   * @param idDto - The ID of the quiz instance for which to fetch quizzes.
   * @returns A list of quizzes associated with the provided quiz instance.
   */
  public async getAllQuizzes({
    id: quizInstanceId,
  }: IdDto): Promise<ApiResponse<Partial<Quiz>[]>> {
    if (quizInstanceId === undefined)
      throw new HttpException(
        'No quiz instance id found',
        HttpStatus.BAD_REQUEST,
      );

    const quizInstance = await this.db.quiz.findMany({
      where: { quizInstanceId },
      select: {
        id: true,
        question: true,
        options: true,
      },
    });

    return {
      data: quizInstance,
      success: true,
      message: 'Quizzes fetched successfully',
      statusCode: HttpStatus.OK,
    };
  }

  /**
   * Submit Quiz
   * 
   * Submits the answers for the given quiz instance and calculates the acquired marks.
   * @param submitAnswerDto - The answer sheet and quiz instance ID for submission.
   * @returns The updated quiz instance with the acquired marks and submission status.
   */
  public async submitQuiz({
    answerSheet,
    quizInstanceId,
  }: SubmitAnswerDto): Promise<ApiResponse<QuizInstance>> {
    if (quizInstanceId === undefined)
      throw new HttpException(
        'No quiz instance id found',
        HttpStatus.BAD_REQUEST,
      );

    const quizInstance = await this.db.quizInstance.findUnique({
      where: { id: quizInstanceId },
      include: {
        quiz: true,
      },
    });

    if (!quizInstance)
      throw new HttpException('Quiz instance not found', HttpStatus.NOT_FOUND);

    let acquiredMark = 0;

    await quizInstance.quiz.forEach((e) => {
      answerSheet.find((a) =>
        a.quizId === e.id && a.answer === e.correctAnswer
          ? acquiredMark++
          : false,
      );
    });

    const updated = await this.db.quizInstance.update({
      where: { id: quizInstanceId },
      data: {
        acquiredMark,
        totalMark: quizInstance.quiz.length,
        isSubmitted: true,
      },
    });
    return {
      data: updated,
      success: true,
      message: 'Quiz submitted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
