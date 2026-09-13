import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard, type AuthenticatedRequest } from '../../common/auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../../common/auth/roles.guard';
import { CreateJobDto } from './dto/create-job.dto';
import { ProposeConfirmationDto } from './dto/propose-confirmation.dto';
import { RaiseDisputeDto } from './dto/raise-dispute.dto';
import { StartJobDto } from './dto/start-job.dto';
import { JobsService } from './jobs.service';

type CurrentUserType = AuthenticatedRequest['user'];

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Post()
  @Roles('customer')
  create(@CurrentUser() user: CurrentUserType, @Body() dto: CreateJobDto) {
    return this.jobs.create(user.id, dto);
  }

  @Get()
  list(
    @CurrentUser() user: CurrentUserType,
    @Query('mine') mine?: string,
    @Query('status') status?: string,
    @Query('nearLat') nearLat?: string,
    @Query('nearLng') nearLng?: string,
  ) {
    const near = nearLat && nearLng ? { latitude: Number(nearLat), longitude: Number(nearLng) } : undefined;
    return this.jobs.list({ userId: user.id, role: user.role, mine: mine === 'true', status, near });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.jobs.findByIdOrThrow(id);
  }

  @Post(':id/negotiate')
  @Roles('mazdoor')
  negotiate(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.jobs.negotiate(id, user.id);
  }

  @Post(':id/propose')
  @Roles('mazdoor')
  propose(@CurrentUser() user: CurrentUserType, @Param('id') id: string, @Body() dto: ProposeConfirmationDto) {
    return this.jobs.proposeConfirmation(id, user.id, dto.price, new Date(dto.time));
  }

  @Post(':id/confirm')
  @Roles('customer')
  confirm(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.jobs.acceptConfirmation(id, user.id);
  }

  @Post(':id/start')
  @Roles('mazdoor')
  start(@CurrentUser() user: CurrentUserType, @Param('id') id: string, @Body() dto: StartJobDto) {
    return this.jobs.start(id, user.id, dto.pin);
  }

  @Post(':id/complete')
  complete(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.jobs.markComplete(id, user.id, user.role);
  }

  @Post(':id/pay')
  @Roles('customer')
  pay(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.jobs.pay(id, user.id);
  }

  @Post(':id/dispute')
  raiseDispute(@CurrentUser() user: CurrentUserType, @Param('id') id: string, @Body() dto: RaiseDisputeDto) {
    return this.jobs.raiseDispute(id, user.id, dto.category, dto.details ?? null);
  }

  @Get(':id/disputes')
  disputes(@Param('id') id: string) {
    return this.jobs.listDisputesForJob(id);
  }
}
