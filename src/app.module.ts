import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';
import { QuizModule } from './main/quiz/quiz.module';

@Module({
  imports: [MainModule, QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
