import { Injectable, NotFoundException } from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class CourseService {
  constructor(private prisma: DbService) {}

  async createCourse(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.prisma.course.create({ data });
  }

  async getAllCourses(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: { 
        classroom: { // ✅ Include classroom relation
          include: { Instructor: true } // ✅ Fetch the instructor from classroom
        },
        modules: true, 
        student: true, // Fixed: 'students' -> 'student' (correct relation name)
      },
    });
  }
  

  async getCourseById(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id: id },
      include: { 
        classroom: {
          include: { Instructor: true } 
        }
      }
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async updateCourse(id: string, data: Prisma.CourseUpdateInput): Promise<Course> {
    try {
      return await this.prisma.course.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException('Course not found');
    }
  }

  async deleteCourse(id: string): Promise<Course> {
    try {
      return await this.prisma.course.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Course not found');
    }
  }
}
