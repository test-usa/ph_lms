import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';;
import { ModuleModule } from './module/module.module';
import { UserModule } from './user/user.module';
import { QuizModule } from './quiz/quiz.module';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './course/course.module';
import { BlogModule } from './blog/blog.module';
import { StudentModule } from './student/student.module';
import { BillingModule } from './billing/billing.module';
import { InstructorModule } from './instructor/instructor.module';

@Module({
  imports: [
    AuthModule, 
    ContentModule, 
    CourseModule, 
    ModuleModule, 
    UserModule, 
    QuizModule, 
    AdminModule, 
    BlogModule, 
    StudentModule, 
    InstructorModule,
    BillingModule, 
  ],
})
export class MainModule {}
