import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { ModuleController } from './module/module.controller';
import { ModuleService } from './module/module.service';
import { ModuleModule } from './module/module.module';
import { DbService } from 'src/db/db.service';
import { QuizModule } from './quiz/quiz.module';
import { QuizService } from './quiz/quiz.service';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, ContentModule, CourseModule, ModuleModule, UserModule, QuizModule, AdminModule],
  controllers: [ModuleController],
  providers: [ModuleService, DbService, QuizService],
})
export class MainModule {}
