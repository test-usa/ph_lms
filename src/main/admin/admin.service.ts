import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import calculatePagination from 'src/utils/calculatePagination';
import { Gender, Prisma, Status, Admin, UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { TUser } from 'src/interface/token.type';

@Injectable()
export class AdminService {
    constructor(private db: DbService) { }

    // --------------------------------------------Get Single Admin---------------------------------------
    public async getSingleAdmin(id: IdDto): Promise<ApiResponse<Admin>> {
        const result = await this.db.admin.findUniqueOrThrow({
            where: {
                id: id.id, 
                isDeleted: false
            }
        });
        return {
            statusCode: 200,
            success: true,
            message: "Admin's data retrieved successfully",
            data: result,
        }
    }

    // -------------------------------------------------Get All Admins------------------------------------------------------------
    public async getAllAdmins(params: any, options: TPaginationOptions): Promise<ApiResponse<Admin[]>> {
        const andConditions: Prisma.AdminWhereInput[] = [];
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

        const result = await this.db.admin.findMany({
            where: {
                AND: andConditions,
                isDeleted: false
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
        const total = await this.db.admin.count({
            where: {
                AND: andConditions,
                isDeleted: false
            },
        });
        return {
            statusCode: 200,
            success: true,
            message: "Admins data retrieved successfully",
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    };

    //------------------------------------------Update Admin------------------------------------------
    public async updateAdmin(
        id: IdDto,
        payload: Partial<Admin>,
        token: TUser
    ): Promise<ApiResponse<Admin>> {
        const existingAdmin = await this.db.admin.findUnique({
            where: {
                id: id.id, 
                isDeleted: false
            }
        });

        if (!existingAdmin) throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        if (existingAdmin.isDeleted) throw new HttpException('Admin is deactivated', HttpStatus.FORBIDDEN);
        if ((token.role==UserRole.STUDENT || token.role === UserRole.ADMIN) && existingAdmin.email !== token.email) throw new HttpException('Unauthorized Access!', HttpStatus.FORBIDDEN);
 
        
        console.log(payload)
        // Perform update
        const updatedAdmin = await this.db.admin.update({
            where: id,
            data: {
                profilePhoto: payload.profilePhoto,
                contact: payload.contact,
                address: payload.address,
                gender: payload.gender,
            },
        });

        return {
            statusCode: 200,
            success: true,
            message: "Admin's data updated successfully",
            data: updatedAdmin,
        };
    }

    // --------------------------------------------Delete Admin-------------------------------------------------
    public async deleteAdmin(id: IdDto): Promise<ApiResponse<void>> {
        const existingAdmin = await this.db.admin.findUnique({
            where: {
                id: id.id, 
                isDeleted: false
            },
            include: { user: true }, 
        });
    
        if (!existingAdmin) {
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }

        await this.db.$transaction(async (tClient) => {
            // Transaction - 01: Update admin: isDeleted: true
            await tClient.admin.update({
                where: id,
                data: { isDeleted: true },
            });

             // Transaction - 02: Update user: status: DELETED
            if (existingAdmin.user) {
                await tClient.user.update({
                    where: { id: existingAdmin.userId },
                    data: { status: Status.DELETED },
                });
            }
        })
    
        return {
            data: null,
            statusCode: 200,
            success: true,
            message: 'Admin and related User have been marked as deleted.',
        };
    }
}
