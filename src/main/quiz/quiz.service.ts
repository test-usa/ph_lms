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
  async createQuizExam(quiz: TQuiz) {
    const result = await prisma.quiz.create({
      data: {
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
      },
    });
    return result;
  }
  async startQuizExam(id: string) {
    const result = await prisma.quiz.findUnique({
      where: {
        id,
      },
    });
    return result;
  }
}
