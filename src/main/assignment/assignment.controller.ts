import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { UserRole } from '@prisma/client';
import { CreateAssignmentDto } from './assignment.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('assignment')
export class AssignmentController {
    constructor(
        private readonly assignmentService: AssignmentService
    ){}

    @Post('create')
    @ApiBearerAuth()
    @UseGuards(
        AuthGuard,
        RoleGuardWith([UserRole.INSTRUCTOR,UserRole.ADMIN,UserRole.SUPER_ADMIN])
    )
    createAssignment(@Body() createAssignment:CreateAssignmentDto){
        return this.assignmentService.createAssignment(createAssignment)
    }

}
