import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';


@Module({
  imports: [AuthModule, ContentModule, CourseModule]
})
export class MainModule {}
