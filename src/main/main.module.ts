import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';;
import { ModuleModule } from './module/module.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { QuizModule } from './quiz/quiz.module';
import { AdminModule } from './admin/admin.module';
import { BillingModule } from './billing/billing.module';
import { AssignmentModule } from './assignment/assignment.module';

@Module({
  imports: [
    AuthModule, 
    ContentModule, 
    CourseModule, 
    ModuleModule, 
    UserModule, 
    QuizModule, 
    AdminModule,
    BillingModule,
    AssignmentModule
  ],
})
export class MainModule {}
