import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { ModuleModule } from './module/module.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [AuthModule, ContentModule, CourseModule, ModuleModule, UserModule, StudentModule],
})
export class MainModule {}
