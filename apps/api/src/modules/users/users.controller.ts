import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard, type AuthenticatedRequest } from '../../common/auth/jwt-auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.users.findByIdOrThrow(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthenticatedRequest['user'], @Body() dto: UpdateMeDto) {
    return this.users.updateMe(user.id, dto);
  }

  /** A job's counterpart profile (name-free — no `name` column exists yet; role/rating/tier only). Distinct path from `me` so route matching never depends on registration order. */
  @Get(':id/public')
  getPublicProfile(@Param('id') id: string) {
    return this.users.findPublicProfile(id);
  }
}
