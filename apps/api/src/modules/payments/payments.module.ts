import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletLedgerEntryEntity } from './entities/wallet-ledger-entry.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

/** Wallet ledger, Raast/1-Link, FBR withholding — see ARCHITECTURE.md §3. */
@Module({
  imports: [TypeOrmModule.forFeature([WalletLedgerEntryEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
