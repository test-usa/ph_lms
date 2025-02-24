import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Status, User, UserRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import { TUser } from 'src/interface/token.type';
import calculatePagination from 'src/utils/calculatePagination';
import { ApiResponse } from 'src/utils/sendResponse';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}

  // Get Me
  async getMe(user: TUser) {
    const result = await this.db.user.findUniqueOrThrow({
      where: { email: user.email },
    });

    const data = {
      id: result.id,
      email: result.email,
      role: result.role,
      status: result.status,
    };
    return data;
  }

  public async createAnUser({
    email,
    password,
    role,
  }): Promise<ApiResponse<User>> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await this.db.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });
    return {
      data: newUser,
      success: true,
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  public async updateAnUser(id: string, payload): Promise<ApiResponse<User>> {
    const { password } = payload;
    if (!password) {
      const updatedUser = await this.db.user.update({
        where: { id },
        data: {
          ...payload,
        },
      });

      return {
        data: updatedUser,
        success: true,
        message: 'User updated successfully',
        statusCode: HttpStatus.OK,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await this.db.user.update({
      where: { id },
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    return {
      data: updatedUser,
      success: true,
      message: 'User updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getAllUsers(params: any, options: TPaginationOptions) {
    const andConditions: Prisma.UserWhereInput[] = [];
    const { searchTerm, ...filteredData } = params;
    const { page, limit, skip } = calculatePagination(options);

    if (params.searchTerm) {
      andConditions.push({
        OR: [
          { email: { contains: params.searchTerm, mode: 'insensitive' } },
          {
            role: Object.values(UserRole).includes(params.searchTerm)
              ? { equals: params.searchTerm as UserRole }
              : undefined,
          },
          {
            status: Object.values(Status).includes(params.searchTerm)
              ? { equals: params.searchTerm as Status }
              : undefined,
          },
        ],
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
              [options.sortBy]: 'asc',
            }
        : {
            createdAt: 'desc',
          },

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
  }

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
  }
}
