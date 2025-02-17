import { Injectable } from '@nestjs/common';

export type TContent = {
  id: string;
  title: string;
  description: string;
};

export type TQuiz = {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number; // Optional, since it's marked as Int? in the model
  contentId?: string | null; // Optional, as it can be null
  content?: TContent | null; // Optional, as content can be null
};

@Injectable()
export class QuizService {
  private readonly quizes: TQuiz[] = [];
  createQuizExam(quiz: TQuiz) {
    this.quizes.push(quiz);
  }
  startQuizExam() {
    return this.quizes;
  }
}
