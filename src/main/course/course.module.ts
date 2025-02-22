import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, DbService],
})
export class CourseModule {}
