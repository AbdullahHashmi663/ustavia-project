import type { WalletLedgerEntry } from '../validation/walletLedger.schema';

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

/**
 * job_payout is the gross job value; platform_commission and fbr_withholding
 * are recorded as negative deductions in the same append-only ledger, so
 * wallet_balance = sum(amount) — matches ARCHITECTURE.md §4's "never mutate a
 * wallet balance directly" rule.
 */
export const MOCK_WALLET_LEDGER: WalletLedgerEntry[] = [
  // job 006 (paid) settlement for mazdoor a1111111
  {
    id: 'e0000000-0000-4000-8000-000000000001',
    mazdoorId: 'a1111111-1111-4111-8111-111111111111',
    jobId: 'b0000000-0000-4000-8000-000000000006',
    amount: 3500,
    type: 'job_payout',
    createdAt: daysAgo(4),
  },
  {
    id: 'e0000000-0000-4000-8000-000000000002',
    mazdoorId: 'a1111111-1111-4111-8111-111111111111',
    jobId: 'b0000000-0000-4000-8000-000000000006',
    amount: -350,
    type: 'platform_commission',
    createdAt: daysAgo(4),
  },
  {
    id: 'e0000000-0000-4000-8000-000000000003',
    mazdoorId: 'a1111111-1111-4111-8111-111111111111',
    jobId: 'b0000000-0000-4000-8000-000000000006',
    amount: -70,
    type: 'fbr_withholding',
    createdAt: daysAgo(4),
  },
  // older settled jobs, not part of MOCK_JOBS, just wallet history
  {
    id: 'e0000000-0000-4000-8000-000000000004',
    mazdoorId: 'a1111111-1111-4111-8111-111111111111',
    jobId: null,
    amount: 5000,
    type: 'job_payout',
    createdAt: daysAgo(15),
  },
  {
    id: 'e0000000-0000-4000-8000-000000000005',
    mazdoorId: 'a1111111-1111-4111-8111-111111111111',
    jobId: null,
    amount: -500,
    type: 'platform_commission',
    createdAt: daysAgo(15),
  },
  {
    id: 'e0000000-0000-4000-8000-000000000006',
    mazdoorId: 'a1111111-1111-4111-8111-111111111111',
    jobId: null,
    amount: -100,
    type: 'fbr_withholding',
    createdAt: daysAgo(15),
  },
];
