import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [AuthModule, ContentModule, CourseModule, ModuleModule],
})
export class MainModule {}
