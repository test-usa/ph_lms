import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller'; // Import the QuizController

@Module({
  controllers: [QuizController], // Now QuizController is recognized
  providers: [QuizService],
})
export class QuizModule {}