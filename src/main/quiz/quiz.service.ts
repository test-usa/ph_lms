import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type TContent = {
  id: string;
  title: string;
  description: string;
};

export type TQuiz = {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  contentId?: string | null;
  content?: TContent | null;
};

@Injectable()
export class QuizService {
  async createQuiz(quiz: TQuiz) {
    const result = await prisma.quiz.create({
      data: {
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
      },
    });
    return result;
  }
  async updateQuiz(id: string, quiz: TQuiz) {
    console.log(quiz);
    const result = await prisma.quiz.update({
      where: {
        id,
      },
      data: {
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
      },
    });
    return result;
  }
  async deleteQuiz(id: string) {
    const result = await prisma.quiz.delete({
      where: {
        id,
      },
    });
    return result;
  }
}
