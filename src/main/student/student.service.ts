import { Injectable } from '@nestjs/common';
import { Gender, Prisma, Status, UserRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class StudentService {
    constructor(private db: DbService) { }

    // Get Single Student
    async getSingleStudent(id: string) {
        const result = await this.db.student.findUniqueOrThrow({
            where: { id }
        });
        return result;
    }

    // Get All Students
    async getAllStudents(params: any, options: TPaginationOptions) {
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
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    };
}
