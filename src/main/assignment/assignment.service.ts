import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateAssignmentDto } from './assignment.dto';
import { ApiResponse } from 'src/utils/sendResponse';
import { Assignment } from '@prisma/client';

@Injectable()
export class AssignmentService {
    constructor(
        private readonly db: DbService
    ) { }

    private async isModuleExist(id: string) {
        const module = await this.db.module.findUnique({
            where: { id },
        });

        if (!module) {
            throw new HttpException("Module not found", HttpStatus.NOT_FOUND);
        }

        return module
    }

    public async addAssignmentToModule({
        moduleId,
        title,
    }: CreateAssignmentDto): Promise<ApiResponse<Assignment>> {
        const module = await this.isModuleExist(moduleId);

        const newAssignment = await this.db.assignment.create({
            data: {
                title,
                moduleId: module.id,
                assuredMark: 0
            },
        });

        return {
            data: newAssignment,
            success: true,
            message: 'Assignment added successfully',
            statusCode: HttpStatus.CREATED,
        }
    }

    public async createAssignment({
         title, file, assuredMark, moduleId
    }:CreateAssignmentDto):Promise<ApiResponse<Assignment>>{
        const newAssignment = await this.db.assignment.create({
            data:{
             title, file, assuredMark,
             moduleId
            }
        })
        return {
            data: newAssignment,
            success: true,
            message: 'Assignment created successfully',
            statusCode: HttpStatus.CREATED,
          };
    }
}
