import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAssignmentDto, MarkAssignmentDto, SubmitAssignmentDto } from './assignment.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Assignment, AssignmentSubmission, SubmissionStatus } from '@prisma/client';

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
  private async isStudentExist({
    userId,
    studentId,
  }: {
    userId?: string;
    studentId?: string;
  }) {
    if (!userId && !studentId) {
      throw new HttpException(
        'Either userId or studentId must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    let student;

    if (userId) {
      // Find student by userId
      student = await this.db.student.findUnique({
        where: { userId, isDeleted: false },
      });
    } else if (studentId) {
      // Find student by studentId
      student = await this.db.student.findUnique({
        where: { id: studentId, isDeleted: false },
      });
    }

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
        deadline: new Date(), // Default value (to be updated by instructor)
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
    userId: string
  ): Promise<ApiResponse<Assignment | AssignmentSubmission>> {
    // Find the student ID associated with the user
    const student = await this.db.student.findUnique({
      where: { userId, isDeleted: false },
      select: { id: true }, // Only get the student ID
    });
  
    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
  
    // Find the assignment
    const assignment = await this.db.assignment.findUnique({
      where: { id: assignmentId },
      include: { content: true }, // Include related content
    });
  
    if (!assignment) {
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    }
  
    // Find the student's submission (if any)
    const submission = await this.db.assignmentSubmission.findFirst({
      where: { assignmentId, studentId: student.id },
      include: {
        assignment: true,
        student: true, // Include student details if needed
      },
    });

  
    if (submission) {
      return {
        data: submission,
        success: true,
        message: 'Assignment submission details retrieved successfully',
        statusCode: HttpStatus.OK,
      };
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
    const assignment = await this.isAssignmentExist(assignmentId);
  
    // Check if the student exists
    const student = await this.isStudentExist({ userId: studentId });
  
    // Check if the student has already submitted this assignment
    const existingSubmission = await this.db.assignmentSubmission.findFirst({
      where: { assignmentId, studentId: student.id },
    });
  
    if (existingSubmission) {
      throw new HttpException(
        'Assignment already submitted by this student',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    const submissionTime = new Date();
    const submissionStatus =
      submissionTime > assignment.deadline ? SubmissionStatus.LATE : SubmissionStatus.ONTIME;

    const newSubmission = await this.db.assignmentSubmission.create({
      data: {
        submission,
        submissionTime,
        submissionStatus,
        acquiredMark: 0,
        isSubmitted: true,
        assignmentId,
        studentId: student.id,
      },
    });
  
    return {
      data: newSubmission,
      success: true,
      message: 'Assignment submitted successfully',
      statusCode: HttpStatus.CREATED,
    };
  }
  

  //----------------------------------------Mark Assignment--------------------------------------------
  public async markAssignment({
    assignmentId,
    studentId,
    acquiredMark,
  }: MarkAssignmentDto): Promise<ApiResponse<AssignmentSubmission>> {
    // Check if the assignment exists

    const assignment = await this.isAssignmentExist(assignmentId);

    // Check if the student exists
    const student = await this.isStudentExist({ studentId }); // Pass an object

    // Check if the student has submitted the assignment
    const submission = await this.db.assignmentSubmission.findFirst({
      where: { assignmentId, studentId: student.id },
    });

    if (!submission) {
      throw new HttpException(
        'Assignment submission not found for this student',
        HttpStatus.NOT_FOUND,
      );
    }

    // Ensure the acquired mark does not exceed the total mark
    if (acquiredMark > assignment.totalMark) {
      throw new HttpException(
        'Acquired mark cannot exceed the total mark of the assignment',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update the assignment submission
    const updatedSubmission = await this.db.assignmentSubmission.update({
      where: { id: submission.id },
      data: {
        acquiredMark,
        isReviewed: true,
      },
    });

    return {
      data: updatedSubmission,
      success: true,
      message: 'Assignment marked successfully',
      statusCode: HttpStatus.OK,
    };
  }

  //----------------------------------------Get All Submissions--------------------------------------------
  public async getAllSubmissions(
    assignmentId?: string,
  ): Promise<ApiResponse<AssignmentSubmission[]>> {
    let submissions;

    if (assignmentId) {
      // Fetch submissions for a specific assignment
      submissions = await this.db.assignmentSubmission.findMany({
        where: { assignmentId },
        include: {
          assignment: true, // Include assignment details
          student: true, // Include student details
        },
      });
    } else {
      // Fetch all submissions
      submissions = await this.db.assignmentSubmission.findMany({
        include: {
          assignment: true, // Include assignment details
          student: true, // Include student details
        },
      });
    }

    if (!submissions || submissions.length === 0) {
      throw new HttpException('No submissions found', HttpStatus.NOT_FOUND);
    }

    return {
      data: submissions,
      success: true,
      message: 'Submissions retrieved successfully',
      statusCode: HttpStatus.OK,
    };
  }
}