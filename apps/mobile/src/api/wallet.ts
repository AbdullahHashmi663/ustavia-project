import type { WalletLedgerEntry } from '@ustavia/shared';

import { apiFetch } from './client';

export interface WalletSummary {
  balance: number;
  entries: WalletLedgerEntry[];
}

export function getWallet(): Promise<WalletSummary> {
  return apiFetch<{ balance: number; entries: Record<string, unknown>[] }>('/wallet/me').then((res) => ({
    balance: res.balance,
    entries: res.entries.map((e) => ({ ...e, createdAt: new Date(e.createdAt as string) }) as unknown as WalletLedgerEntry),
  }));
}
