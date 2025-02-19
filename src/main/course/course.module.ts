import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { DbService } from 'src/db/db.service';

@Module({
  controllers: [CourseController],
<<<<<<< HEAD
  providers: [CourseService, DbService],
=======
  providers: [CourseService]
>>>>>>> fac88401454ec4f910faa0ca643331766c4ec8f4
})
export class CourseModule {}
