import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

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
}
