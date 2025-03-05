import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import {
  CreateAssignmentDto,
  SubmitAssignmentDto,
} from './assignment.dto';
import { RoleGuardWith } from 'src/utils/RoleGuardWith';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserRole } from '@prisma/client';
import { IdDto } from 'src/common/id.dto';
import { Request } from 'express';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) { }

  // Create Assignment
  @Post()
  @UseGuards(
    AuthGuard,
    RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  )
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentService.createAssignment(createAssignmentDto);
  }

  // Start Assignment
  @Get('start-assignment/:id')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async startAssignment(@Param() id: IdDto) {
    return this.assignmentService.startAssignment(id.id);
  }

  // Submit assignment
  @Post('submit-assignment')
  @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
  async submitAssignment(@Body() submitAssignmentDto: SubmitAssignmentDto, @Req() req: Request) {
    const studentId = req.user.id;
    return this.assignmentService.submitAssignment(submitAssignmentDto, studentId);
  }
}