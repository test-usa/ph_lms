import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAssignmentDto, SubmitAssignmentDto } from './assignment.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Assignment, AssignmentSubmission } from '@prisma/client';

@Injectable()
export class AssignmentService {
  constructor(private readonly db: DbService) {}

  //----------------------------------------Is Content Exists--------------------------------------------
  private async isContentExist(id: string) {
    const content = await this.db.content.findUnique({
      where: { id },
    });

    if (!content) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    return content;
  }

  //----------------------------------------Is Assignment Exists--------------------------------------------
  private async isAssignmentExist(id: string) {
    const assignment = await this.db.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    }

    return assignment;
  }

  //----------------------------------------Is Student Exists--------------------------------------------
  private async isStudentExist(id: string) {
    const student = await this.db.student.findUnique({
      where: { userId:id },
    });

    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }

    return student;
  }

  //----------------------------------------Create An Assignment--------------------------------------------
  public async createAssignment({
    title,
    totalMark,
    contentId,
  }: CreateAssignmentDto): Promise<ApiResponse<Assignment>> {
    // Check if the content exists
    await this.isContentExist(contentId);

    // Create the assignment
    const newAssignment = await this.db.assignment.create({
      data: {
        title,
        totalMark,
        contentId,
      },
    });

    return {
      data: newAssignment,
      success: true,
      message: 'Assignment created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  //----------------------------------------Start Assignment--------------------------------------------
  public async startAssignment(
    assignmentId: string,
  ): Promise<ApiResponse<Assignment>> {
    const assignment = await this.db.assignment.findUnique({
      where: { id: assignmentId },
      include: { content: true }, // Include associated content
    });

    if (!assignment) {
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    }

    return {
      data: assignment,
      success: true,
      message: 'Assignment details retrieved successfully',
      statusCode: HttpStatus.OK,
    };
  }

  //----------------------------------------Submit Assignment--------------------------------------------
  public async submitAssignment(
    { assignmentId, submission }: SubmitAssignmentDto,
    studentId: string,
  ): Promise<ApiResponse<AssignmentSubmission>> {
    // Check if the assignment exists
    await this.isAssignmentExist(assignmentId);

    // Check if the student exists
   const student = await this.isStudentExist(studentId);
   console.log(student.id)

    // Check if the student has already submitted this assignment
    const existingSubmission = await this.db.assignmentSubmission.findFirst({
      where: { assignmentId, studentId:student.id },
    });

    if (existingSubmission) {
      throw new HttpException(
        'Assignment already submitted by this student',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create the assignment submission
    const newSubmission = await this.db.assignmentSubmission.create({
      data: {
        submission,
        acquiredMark: 0, // Default value (to be updated by instructor)
        isSubmitted: true,
        isReviewed: false, // Default value
        assignmentId,
        studentId:student.id,
      },
    });

    return {
      data: newSubmission,
      success: true,
      message: 'Assignment submitted successfully',
      statusCode: HttpStatus.CREATED,
    };
  }
}