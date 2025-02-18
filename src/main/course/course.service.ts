import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCourseDto } from './course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly db: DbService) {}

  public async createCourse(data: CreateCourseDto) {
    const course = await this.db.course.create({
      data,
    });

    return course;
  }
}
