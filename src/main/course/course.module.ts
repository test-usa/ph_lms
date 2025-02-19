import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, DbService],
})
export class CourseModule {}
