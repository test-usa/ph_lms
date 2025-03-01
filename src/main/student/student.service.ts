import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';
import { Gender, Prisma, Status, Student, UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { UpdateStudentDto } from './student.Dto';


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
        studentId: IdDto,
        payload: Partial<Student>
    ): Promise<ApiResponse<Student>> {
        const existingStudent = await this.db.student.findUnique({
            where: studentId,
        });

        if (!existingStudent) throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
        if (existingStudent.isDeleted) throw new HttpException('Student is deactivated', HttpStatus.FORBIDDEN);

        const { id, email, userId, courseId, ...updatableFields } = payload;

        // Perform update
        const updatedStudent = await this.db.student.update({
            where: studentId,
            data: updatableFields,
        });

        return {
            statusCode: 200,
            success: true,
            message: "Student's data updated successfully",
            data: updatedStudent,
        };
    }

}
