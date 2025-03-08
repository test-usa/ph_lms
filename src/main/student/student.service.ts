import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';
import { Gender, Prisma, Status, Student, UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { TUser } from 'src/interface/token.type';


@Injectable()
export class StudentService {
    constructor(private db: DbService) { }

    // --------------------------------------------Get Single Student---------------------------------------
    public async getSingleStudent(id: IdDto): Promise<ApiResponse<Student>> {
        const result = await this.db.student.findUniqueOrThrow({
            where: {
                id: id.id, 
                isDeleted: false
            }
        });
        return {
            statusCode: 200,
            success: true,
            message: "Student's data retrieved successfully",
            data: result,
        }
    }

    // -------------------------------------------------Get All Students------------------------------------------------------------
    public async getAllStudents(params: any, options: TPaginationOptions): Promise<ApiResponse<Student[]>> {
        const andConditions: Prisma.StudentWhereInput[] = [];
        const { searchTerm, ...filteredData } = params;
        const { page, limit, skip } = calculatePagination(options);

        if (params.searchTerm) {
            andConditions.push({
                OR: [
                    { contact: { contains: params.searchTerm } },
                    { gender: Object.values(Gender).includes(params.searchTerm) ? { equals: params.searchTerm as Gender } : undefined },
                ]
            });
        }

        if (Object.keys(filteredData).length > 0) {
            andConditions.push({
                AND: Object.keys(filteredData).map((key) => ({
                    [key]: {
                        equals: (filteredData as any)[key],
                    },
                })),
            });
        }

        const result = await this.db.student.findMany({
            where: {
                AND: andConditions,
                isDeleted: false,
            },
            skip: skip,
            take: limit,
            orderBy: options.sortBy
                ? options.sortOrder
                    ? {
                        [options.sortBy]: options.sortOrder,
                    }
                    : {
                        [options.sortBy]: "asc",
                    }
                : {
                    createdAt: "desc",
                },
        });
        const total = await this.db.student.count({
            where: {
                AND: andConditions,
                isDeleted: false
            },
        });
        return {
            statusCode: 200,
            success: true,
            message: "Students data retrieved successfully",
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    };

    //------------------------------------------Update Student------------------------------------------
    public async updateStudent(
        id: IdDto,
        payload: Partial<Student>,
        token: TUser
    ): Promise<ApiResponse<Student>> {
        const existingStudent = await this.db.student.findUnique({
            where: {
                id: id.id, 
                isDeleted: false
            }
        });

        if (!existingStudent) throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
        if (existingStudent.isDeleted) throw new HttpException('Student is deactivated', HttpStatus.FORBIDDEN);
        if (token.role == UserRole.STUDENT && existingStudent.email !== token.email) throw new HttpException('Unauthorized Access!', HttpStatus.FORBIDDEN);

        // Perform update
        const updatedStudent = await this.db.student.update({
            where: id,
            data: {
                name: payload.name,
                profilePhoto: payload.profilePhoto,
                contact: payload.contact,
                address: payload.address,
                gender: payload.gender,
            },
        });

        if(payload.name){
            await this.db.user.update({
                where: { id: existingStudent.userId },
                data: { name: payload.name },
            });
        }

        return {
            statusCode: 200,
            success: true,
            message: "Student's data updated successfully",
            data: updatedStudent,
        };
    }

    // --------------------------------------------Delete Student-------------------------------------------------
    public async deleteStudent(id: IdDto): Promise<ApiResponse<void>> {
        const existingStudent = await this.db.student.findUnique({
            where: {
                id: id.id, 
                isDeleted: false
            },
            include: { user: true },
        });

        if (!existingStudent) {
            throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
        }

        await this.db.$transaction(async (tClient) => {
            // Transaction - 01: Update student: isDeleted: true
            await tClient.student.update({
                where: id,
                data: { isDeleted: true },
            });

            // Transaction - 02: Update user: status: DELETED
            if (existingStudent.user) {
                await tClient.user.update({
                    where: { id: existingStudent.userId },
                    data: { status: Status.DELETED },
                });
            }
        })

        return {
            data: null,
            statusCode: 200,
            success: true,
            message: 'Student and related User have been marked as deleted.',
        };
    }


    //----------------------------------------Set Progress--------------------------------------------------
    public async setProgress(courseId: string, email: string, contentId: string): Promise<ApiResponse<{ watchedCourses: string[]; percentage: number; }>> {
        // Check if student exists and currently enrolled in the requested course or not
        const user = await this.db.user.findUnique({
            where: { email, status: Status.ACTIVE }
        });
        if (!user) throw new HttpException('User not found', 401)
        const userId = user?.id
        const student = await this.db.student.findUnique({
            where: { userId, isDeleted: false },
            include: { course: true },
        });
        if (!student || !student.course) throw new HttpException('No enrolled courses found for this student', 401)

        // Arrange an array of content for the course
        const modules = await this.db.module.findMany({
            where: { courseId },
            include: {
                content: {
                    orderBy: { createdAt: 'asc' },
                    select: { id: true },
                },
            },
        });
        const contentIds = modules.flatMap(module => module.content.map(content => content.id));

        // If requested content does not exist in the course, throe error
        const index = contentIds.findIndex(content => content === contentId);
        if (index === -1) throw new HttpException('Course not found in enrolled courses.', 401)

        // If user tries to jump 
        const existingProgress = await this.db.progress.findUnique({
            where: { studentId_courseId: { studentId: student.id, courseId } },
        });
        if (!existingProgress && contentIds[0] !== contentId) {
            throw new HttpException('This content is locked. Start from the first content.', 403);
        }
        const prevIndex = contentIds.findIndex(content => content === existingProgress?.contentId);
        if (existingProgress && index - 1 > prevIndex) {
            throw new HttpException('This content is locked. Please complete previous contents first.', 403);
        }

        const percentage = Math.round(((index + 1) / contentIds.length) * 100);

        await this.db.progress.upsert({
            where: { studentId_courseId: { studentId: student.id, courseId } },
            update: { percentage, contentId },
            create: { studentId: student.id, courseId, percentage, contentId },
        });
        const watchedCourses = contentIds.slice(0, index + 1);

        return {
            success: true,
            message: 'Progress calculated successfully.',
            statusCode: HttpStatus.OK,
            data: {
                watchedCourses,
                percentage
            },
        };
    }


    //----------------------------------------Get Progress-------------------------------------------------
    public async getProgress( courseId: string, email: string ): Promise<ApiResponse<any>> {
        const student = await this.db.student.findUnique({
            where: { email, isDeleted: false },
            select: { id: true },
        });
        if (!student) {
            throw new HttpException('Student not found', 404);
        }

        // Check if the student is enrolled in the course
        const isEnrolled = await this.db.course.findFirst({
            where: {
                id: courseId,
                student: {
                    some: {
                        id: student.id,
                    },
                },
            },
        });
        if (!isEnrolled) {
            throw new HttpException('You are not enrolled in this course', HttpStatus.FORBIDDEN);
        }

        // Get the progress of the course for the student
        const courseProgress = await this.db.progress.findUnique({
            where: {
                studentId_courseId: {
                    studentId: student.id,
                    courseId: courseId,
                },
            },
            select: {
                percentage: true,
            },
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Progress retrieved successfully',
            data:  courseProgress?.percentage || 0
        };
    }


}
