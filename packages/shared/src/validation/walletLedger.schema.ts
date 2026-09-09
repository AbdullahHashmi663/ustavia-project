import { z } from 'zod';

/** Every credit/debit against a Mazdoor's wallet. Append-only — never mutated. */
export const WALLET_LEDGER_ENTRY_TYPES = [
  'job_payout',
  'platform_commission',
  'fbr_withholding',
  'cancellation_penalty',
  'promo_adjustment',
] as const;

export type WalletLedgerEntryType = (typeof WALLET_LEDGER_ENTRY_TYPES)[number];

export const walletLedgerEntrySchema = z.object({
  id: z.string().uuid(),
  mazdoorId: z.string().uuid(),
  jobId: z.string().uuid().nullable(),
  amount: z.number(),
  type: z.enum(WALLET_LEDGER_ENTRY_TYPES),
  createdAt: z.coerce.date(),
});

export type WalletLedgerEntry = z.infer<typeof walletLedgerEntrySchema>;
