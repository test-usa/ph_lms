import { Injectable } from '@nestjs/common';
import { Admin, Instructor, Prisma, Status, Student, UserRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import { TUser } from 'src/interface/token.type';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class UserService {
    constructor(private db: DbService) { }

    // Get Me
    async getMe(user: TUser): Promise<Student | Instructor | Admin | null> {
        let result: Student | Instructor | Admin

        if (user.role == "STUDENT") {
            result = await this.db.student.findUniqueOrThrow({
                where: { email: user.email }
            });
        }
        else if (user.role == "ADMIN") {
            result = await this.db.admin.findUniqueOrThrow({
                where: { email: user.email },
                include: {
                    User:{
                        select :{
                            email: true,
                            id: true,
                            role: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                    
                }
            });
        }
        else if (user.role == "SUPER_ADMIN") {
            result = await this.db.admin.findUniqueOrThrow({
                where: { email: user.email },
               include: {
                    User:{
                        select :{
                            email: true,
                            id: true,
                            role: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                    
                }
            });
        }
        else {
            result = await this.db.instructor.findUniqueOrThrow({
                where: { email: user.email },
               include: {
                    User:{
                        select :{
                            email: true,
                            id: true,
                            role: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                    
                }
            });
        }
        return result;
    }

    // Get All Users
    async getAllUsers(params: any, options: TPaginationOptions) {
        const andConditions: Prisma.UserWhereInput[] = [];
        const { searchTerm, ...filteredData } = params;
        const { page, limit, skip } = calculatePagination(options);

        if (params.searchTerm) {
            andConditions.push({
                OR: [
                    { email: { contains: params.searchTerm, mode: "insensitive" } },
                    { role: Object.values(UserRole).includes(params.searchTerm) ? { equals: params.searchTerm as UserRole } : undefined },
                    { status: Object.values(Status).includes(params.searchTerm) ? { equals: params.searchTerm as Status } : undefined },
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

        const result = await this.db.user.findMany({
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
            // Excluding password from response
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        const total = await this.db.user.count({
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

    // Change profile status
    async changeProfileStatus(id: string, status: Status) {
        await this.db.user.findUniqueOrThrow({
            where: {
                id,
            },
        });

        const updatedUserStatus = await this.db.user.update({
            where: {
                id,
            },
            data: { status },
        });

        return updatedUserStatus;
    };
}