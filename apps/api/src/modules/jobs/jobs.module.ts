import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletLedgerEntryEntity } from '../payments/entities/wallet-ledger-entry.entity';
import { DisputeEntity } from './entities/dispute.entity';
import { JobEntity } from './entities/job.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

/** Job lifecycle state machine, matching, quotes — see ARCHITECTURE.md §3 and §5. */
@Module({
  imports: [TypeOrmModule.forFeature([JobEntity, DisputeEntity, WalletLedgerEntryEntity])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
