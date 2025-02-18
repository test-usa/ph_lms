import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './main/main.module';
import { DbModule } from './db/db.module';
import { ContentController } from './main/content/content.controller';
import { ContentService } from './main/content/content.service';
import { DbService } from './db/db.service';
import { ModuleController } from './main/module/module.controller';
import { ModuleService } from './main/module/module.service';
import { QuizController } from './main/quiz/quiz.controller';
import { QuizService } from './main/quiz/quiz.service';

@Module({
  imports: [MainModule, DbModule],
  controllers: [AppController, ContentController, ModuleController, QuizController],
  providers: [AppService, ContentService, DbService, ModuleService, QuizService],
})
export class AppModule {}
