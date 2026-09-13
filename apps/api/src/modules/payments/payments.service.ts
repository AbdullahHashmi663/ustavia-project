import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WalletLedgerEntryEntity } from './entities/wallet-ledger-entry.entity';

@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(WalletLedgerEntryEntity) private readonly ledger: Repository<WalletLedgerEntryEntity>) {}

  /** Balance is always sum(amount) over the append-only ledger, never a stored column — ARCHITECTURE.md §4. */
  async getWallet(mazdoorId: string) {
    const entries = await this.ledger.find({ where: { mazdoorId }, order: { createdAt: 'DESC' } });
    const balance = entries.reduce((sum, e) => sum + Number(e.amount), 0);
    return { balance, entries };
  }
}
