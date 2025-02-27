import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';
import { Gender, Prisma, Status, Student, UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';


@Injectable()
export class StudentService {
    constructor(private db: DbService) { }

    // Get Single Student
    async getSingleStudent(id: IdDto):Promise<ApiResponse<Student>> {
        const result = await this.db.student.findUniqueOrThrow({
            where:  id 
        });
        return {
            statusCode: 200,
            success: true,
            message: "Student's data retrieved successfully",
            data: result,
        }
    }

    // Get All Students
    async getAllStudents(params: any, options: TPaginationOptions):Promise<ApiResponse<Student[]>> {
        const andConditions: Prisma.StudentWhereInput[] = [];
        const { searchTerm, ...filteredData } = params;
        const { page, limit, skip } = calculatePagination(options);

        if (params.searchTerm) {
            andConditions.push({
                OR: [
                    { email: { contains: params.searchTerm, mode: "insensitive" } },
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
            // select: {
            //     id: true,
            //     name: true,
            //     profilePhoto: true,
            //     address: true,
            //     email: true,
            //     contact: true,
            //     gender: true,
            //     createdAt: true,
            //     updatedAt: true,
            // },
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
}
