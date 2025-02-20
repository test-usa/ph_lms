import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';

const prisma = new PrismaClient();

@Injectable()
export class AdminService {
  async getAllAdmin() {
    const result = await prisma.admin.findMany({
      where: {
        isDeleted: false,
      },
    });
    return result;
  }

  async getSingleAdmin(id: string) {
    const result = await prisma.admin.findUnique({
      where: {
        isDeleted: false,
        id,
      },
    });
    return result;
  }

  async updateAdmin(id: string, payload: UpdateAdminProfileDto) {
    const result = await prisma.admin.update({
      where: {
        isDeleted: false,
        id,
      },
      data: {
        ...payload,
      },
    });
    return result;
  }

  async deleteAdmin(id: string) {
    const result = await prisma.admin.update({
      where: {
        isDeleted: false,
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    return result;
  }
}
