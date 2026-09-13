import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { WALLET_LEDGER_ENTRY_TYPES, type WalletLedgerEntryType } from '@ustavia/shared';

/**
 * ARCHITECTURE.md §4 `wallet_ledger` — append-only, never mutated. A
 * Mazdoor's wallet balance is always `sum(amount)` over their rows here,
 * never a stored column that could drift from the transaction history.
 */
@Entity('wallet_ledger')
export class WalletLedgerEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  mazdoorId!: string;

  @Column({ type: 'uuid', nullable: true })
  jobId!: string | null;

  @Column({ type: 'real' })
  amount!: number;

  @Column({ type: 'varchar', length: 32 })
  type!: WalletLedgerEntryType;

  @CreateDateColumn()
  createdAt!: Date;
}

export { WALLET_LEDGER_ENTRY_TYPES };
