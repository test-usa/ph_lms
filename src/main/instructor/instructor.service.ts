import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';
import { Gender, Prisma, Status, Instructor, UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { TUser } from 'src/interface/token.type';

@Injectable()
export class InstructorService {
    constructor(private db: DbService) { }

    // --------------------------------------------Get Single Instructor---------------------------------------
    public async getSingleInstructor(id: IdDto): Promise<ApiResponse<Instructor>> {
        const result = await this.db.instructor.findUniqueOrThrow({
            where: id
        });
        return {
            statusCode: 200,
            success: true,
            message: "Instructor's data retrieved successfully",
            data: result,
        }
    }

    // -------------------------------------------------Get All Instructors------------------------------------------------------------
    public async getAllInstructors(params: any, options: TPaginationOptions): Promise<ApiResponse<Instructor[]>> {
        const andConditions: Prisma.InstructorWhereInput[] = [];
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

        const result = await this.db.instructor.findMany({
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
        const total = await this.db.instructor.count({
            where: {
                AND: andConditions,
            },
        });
        return {
            statusCode: 200,
            success: true,
            message: "Instructors data retrieved successfully",
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    };

    //------------------------------------------Update Instructor------------------------------------------
    public async updateInstructor(
        id: IdDto,
        payload: Partial<Instructor>,
        token: TUser
    ): Promise<ApiResponse<Instructor>> {
        const existingInstructor = await this.db.instructor.findUnique({
            where: id,
        });

        if (!existingInstructor) throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
        if (existingInstructor.isDeleted) throw new HttpException('Instructor is deactivated', HttpStatus.FORBIDDEN);
        if ((token.role === UserRole.STUDENT || token.role === UserRole.INSTRUCTOR) && existingInstructor.email !== token.email) throw new HttpException('Unauthorized Access!', HttpStatus.FORBIDDEN);

        // Perform update
        const updatedInstructor = await this.db.instructor.update({
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
            message: "Instructor's data updated successfully",
            data: updatedInstructor,
        };
    }

    // --------------------------------------------Delete Instructor-------------------------------------------------
    public async deleteInstructor(id: IdDto): Promise<ApiResponse<void>> {
        const existingInstructor = await this.db.instructor.findUnique({
            where: id,
            include: { user: true }, 
        });
    
        if (!existingInstructor) {
            throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
        }
        if (existingInstructor.isDeleted) {
            throw new HttpException('Instructor is already deleted', HttpStatus.BAD_REQUEST);
        }
    
        await this.db.$transaction(async (tClient) => {
            // Transaction - 01: Update instructor: isDeleted: true
            await tClient.instructor.update({
                where: id,
                data: { isDeleted: true },
            });

             // Transaction - 02: Update user: status: DELETED
            if (existingInstructor.user) {
                await tClient.user.update({
                    where: { id: existingInstructor.userId },
                    data: { status: Status.DELETED },
                });
            }
        });
    
        return {
            data: null,
            statusCode: 200,
            success: true,
            message: 'Instructor and related User have been marked as deleted.',
        };
    }
}
