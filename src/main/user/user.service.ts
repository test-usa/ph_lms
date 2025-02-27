import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin, Instructor, Prisma, Status, Student, User, UserRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { TPaginationOptions } from 'src/interface/pagination.type';
import { TUser } from 'src/interface/token.type';
import calculatePagination from 'src/utils/calculatePagination';
import { ApiResponse } from 'src/utils/sendResponse';
import { CreateAnUserDto } from './user.Dto';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DbService,
    private readonly lib: LibService
  ) { }

  //--------------------------------------- Get Me---------------------------------------
  public async getMe(user: TUser): Promise<ApiResponse<Student | Instructor | Admin | null>> {
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
          User: {
            select: {
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
          User: {
            select: {
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
          User: {
            select: {
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

    return {
      data: result,
      success: true,
      message: 'User data fetched Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  //-------------------------------------- Get All Users--------------------------------
  public async getAllUsers(params: any, options: TPaginationOptions) {
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
  }

  //----------------------------------------- Change profile status--------------------------------
  public async changeProfileStatus(id: string, status: Status): Promise<ApiResponse<User>> {
    await this.db.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const updatedUser = await this.db.user.update({
      where: {
        id,
      },
      data: { status },
    });

    if (status === Status.DELETED) {
      if (updatedUser.role == UserRole.STUDENT) {
        await this.db.student.update({
          where: { id },
          data: { isDeleted: true },
        });
      } else if (updatedUser.role == UserRole.INSTRUCTOR) {
        await this.db.instructor.update({
          where: { id },
          data: { isDeleted: true },
        });
      } else {
        await this.db.admin.update({
          where: { id },
          data: { isDeleted: true },
        });
      }
    }

    return {
      data: updatedUser,
      success: true,
      message: 'User status changed successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  //-------------------------------------------Create Instructor------------------------------------------
  public async createInstructor({
    name,
    email,
    password,
  }: CreateAnUserDto): Promise<ApiResponse<User>> {
    const hashedPassword = await this.lib.hashPassword({
      password,
      round: 6,
    });
    const newUser = await this.db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.INSTRUCTOR,
      },
    })
    await this.db.instructor.create({
      data: {
        email,
        name,
        userId: newUser.id
      },
    });
    return {
      success: true,
      message: 'Instructor created successfully',
      statusCode: HttpStatus.CREATED,
      data: newUser,
    }

  }

  // ---------------------------------------Create Admin----------------------------------
  public async createAdmin({
    name,
    email,
    password,
  }: CreateAnUserDto): Promise<ApiResponse<User>> {
    const hashedPassword = await this.lib.hashPassword({
      password,
      round: 6,
    });
    const newUser = await this.db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });
    await this.db.admin.create({
      data: {
        email,
        name,
        userId: newUser.id
      },
    });
    return {
      success: true,
      message: 'Admin created successfully',
      statusCode: HttpStatus.CREATED,
      data: newUser,
    }
  }

}