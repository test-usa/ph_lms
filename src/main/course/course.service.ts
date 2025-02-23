import { HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateCourseDto } from './course.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Course } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private readonly db: DbService) {}

  public async createCourse(data: CreateCourseDto):Promise<ApiResponse<Course>> {
    const course = await this.db.course.create({
      data,
    });

    return {
      data:course,
      success: true,
      message: 'Course created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }
}
