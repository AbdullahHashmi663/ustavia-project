import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard, type AuthenticatedRequest } from '../../common/auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../../common/auth/roles.guard';
import { PaymentsService } from './payments.service';

/**
 * Wallet read model only in this pass — withdrawal + bank account
 * management aren't implemented server-side yet (apps/mobile's
 * WithdrawalScreen/AddBankAccountScreen still use the local mock store for
 * those). Raast/1-Link payout integration is a real product/vendor
 * decision (PLANNING.md §6, item 12), not something to wire up silently.
 */
@Controller('wallet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get('me')
  @Roles('mazdoor')
  getMe(@CurrentUser() user: AuthenticatedRequest['user']) {
    return this.payments.getWallet(user.id);
  }
}
