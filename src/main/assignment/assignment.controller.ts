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
  import { ApiBearerAuth } from '@nestjs/swagger';
  import { RoleGuardWith } from 'src/utils/RoleGuardWith';
  import { AuthGuard } from 'src/guard/auth.guard';
  import { UserRole } from '@prisma/client';
  import { IdDto } from 'src/common/id.dto';
  
  @Controller('assignment')
  export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) {}
  
    /**
     * Create a new assignment.
     * Only instructors, admins, and super admins can access this endpoint.
     */
    @Post('create')
    @ApiBearerAuth()
    @UseGuards(
      AuthGuard,
      RoleGuardWith([UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    )
    async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto) {
      return this.assignmentService.createAssignment(createAssignmentDto);
    }
  
    /**
     * Start an assignment (fetch assignment details for a student).
     * Only students can access this endpoint.
     */
    @Get('start/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
    async startAssignment(@Param() id: IdDto) {
      return this.assignmentService.startAssignment(id.id);
    }
  
    /**
     * Submit an assignment.
     * Only students can access this endpoint.
     */
    @Post('submit')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RoleGuardWith([UserRole.STUDENT]))
    async submitAssignment(
      @Body() submitAssignmentDto: SubmitAssignmentDto,
      @Req() req,
    ) {
      const studentId = req.user.id; // Extract student ID from the authenticated user
      return this.assignmentService.submitAssignment(submitAssignmentDto, studentId);
    }
  }