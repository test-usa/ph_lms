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
            where: id
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
            where: id,
        });

        if (!existingStudent) throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
        if (existingStudent.isDeleted) throw new HttpException('Student is deactivated', HttpStatus.FORBIDDEN);
        if (token.role == UserRole.STUDENT && existingStudent.email !== token.email) throw new HttpException('Unauthorized Access!', HttpStatus.FORBIDDEN);

        // Perform update
        const updatedStudent = await this.db.student.update({
            where: id,
            data: {
                profilePhoto: payload.profilePhoto,
                phone: payload.phone,
                contact: payload.contact,
                address: payload.address,
                gender: payload.gender,
            },
        });

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
            where: id,
            include: { user: true },
        });

        if (!existingStudent) {
            throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
        }
        if (existingStudent.isDeleted) {
            throw new HttpException('Student is already deleted', HttpStatus.BAD_REQUEST);
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


    //----------------------------------------Calculate Progress--------------------------------------------------
    public async calculateProgress(userId: string, courseId: string): Promise<ApiResponse<number>> {

        const student = await this.db.student.findUnique({
            where: { userId },
            include: { course: true },
        });

        if (!student || !student.course) {
            return {
                success: false,
                message: 'No enrolled courses found for this student.',
                statusCode: HttpStatus.NOT_FOUND,
                data: null,
            };
        }

        const modules = await this.db.module.findMany({
            where: { courseId },
            select: {
                content: {
                    select: { id: true },
                },
            },
        });
        const contentIds = modules.flatMap(module => module.content.map(content => content.id));
        const index = contentIds.findIndex(course => course === courseId);
        if (index === -1) {
            return {
                success: false,
                message: 'Course not found in enrolled courses.',
                statusCode: HttpStatus.NOT_FOUND,
                data: null,
            };
        }
        const percentage = Math.round((index / contentIds.length) * 100);

        await this.db.progress.upsert({
            where: { studentId_courseId: { studentId: student.id, courseId } },
            update: { percentage },
            create: { studentId: student.id, courseId, percentage },
        });

        return {
            success: true,
            message: 'Progress calculated successfully.',
            statusCode: HttpStatus.OK,
            data: percentage,
        };
    }

}
