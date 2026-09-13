import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  DEFAULT_WITHDRAWAL_FEE_PERCENTAGE,
  MOCK_BANK_ACCOUNTS,
  MOCK_CUSTOMERS,
  MOCK_MATERIAL_QUOTES,
  MOCK_MAZDOORS,
  MOCK_SOS_ACTIVE_JOB_IDS,
  MOCK_WALLET_LEDGER,
  type BankAccount,
  type BankAccountType,
  type Customer,
  type MaterialQuote,
  type Mazdoor,
  type WalletLedgerEntry,
} from '@ustavia/shared';

import { generateId } from '../utils/id';

/**
 * What's left of the old mock store once the job lifecycle and chat moved
 * to the real backend (`src/api/jobs.ts`/`chat.ts`, PLANNING.md's execution
 * log) — the corners that still have no server endpoint at all: bank
 * accounts, material quotes, SOS toggling, and wallet withdrawal. `jobs`,
 * `chatMessages`, `disputes`, and `jobAcks` are gone from here; job/chat
 * screens now read `useJob`/`useChatMessages`/etc. from `src/api/hooks.ts`.
 *
 * `mazdoors`/`customers` stay as pre-seeded fixture arrays purely for
 * WalletScreen's tier/rating lookup, which is also still unwired (see that
 * screen) — a real logged-in user's id won't match any fixture in here, so
 * that lookup simply finds nothing for a real account, which is correct:
 * there's no real "tier" data flowing from anywhere yet either.
 */
interface JobsState {
  walletLedger: WalletLedgerEntry[];
  mazdoors: Mazdoor[];
  customers: Customer[];
  bankAccounts: BankAccount[];
  materialQuotes: MaterialQuote[];
  sosActiveJobIds: string[];

  toggleSos: (jobId: string) => void;
  addBankAccount: (input: {
    mazdoorId: string;
    bankName: string;
    accountHolderName: string;
    accountNumberLast4: string;
    accountType: BankAccountType;
  }) => BankAccount;
  withdraw: (mazdoorId: string, bankAccountId: string, amount: number) => void;
  proposeMaterialQuote: (jobId: string, description: string, amount: number) => MaterialQuote;
  respondMaterialQuote: (quoteId: string, approve: boolean) => void;
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      walletLedger: MOCK_WALLET_LEDGER,
      mazdoors: MOCK_MAZDOORS,
      customers: MOCK_CUSTOMERS,
      bankAccounts: MOCK_BANK_ACCOUNTS,
      materialQuotes: MOCK_MATERIAL_QUOTES,
      sosActiveJobIds: MOCK_SOS_ACTIVE_JOB_IDS,

      toggleSos: (jobId) => {
        set((state) => ({
          sosActiveJobIds: state.sosActiveJobIds.includes(jobId)
            ? state.sosActiveJobIds.filter((id) => id !== jobId)
            : [...state.sosActiveJobIds, jobId],
        }));
      },

      addBankAccount: ({ mazdoorId, bankName, accountHolderName, accountNumberLast4, accountType }) => {
        const account: BankAccount = {
          id: generateId(),
          mazdoorId,
          bankName,
          accountHolderName,
          accountNumberLast4,
          accountType,
          isDefault: !get().bankAccounts.some((a) => a.mazdoorId === mazdoorId),
          createdAt: new Date(),
        };
        set((state) => ({ bankAccounts: [...state.bankAccounts, account] }));
        return account;
      },

      /** Deducts amount + a percentage fee from the Mazdoor's wallet — Workers.pdf §8.2. */
      withdraw: (mazdoorId, bankAccountId, amount) => {
        const account = get().bankAccounts.find((a) => a.id === bankAccountId && a.mazdoorId === mazdoorId);
        if (!account) throw new Error('Unknown bank account for this Mazdoor');
        if (amount <= 0) throw new Error('Withdrawal amount must be positive');

        const fee = Math.round(amount * (DEFAULT_WITHDRAWAL_FEE_PERCENTAGE / 100));
        const entry: WalletLedgerEntry = {
          id: generateId(),
          mazdoorId,
          jobId: null,
          amount: -(amount + fee),
          type: 'withdrawal',
          createdAt: new Date(),
        };
        set((state) => ({ walletLedger: [...state.walletLedger, entry] }));
      },

      proposeMaterialQuote: (jobId, description, amount) => {
        const quote: MaterialQuote = {
          id: generateId(),
          jobId,
          description,
          amount,
          status: 'pending',
          createdAt: new Date(),
          respondedAt: null,
        };
        set((state) => ({ materialQuotes: [...state.materialQuotes, quote] }));
        return quote;
      },

      respondMaterialQuote: (quoteId, approve) => {
        set((state) => ({
          materialQuotes: state.materialQuotes.map((q) =>
            q.id === quoteId ? { ...q, status: approve ? 'approved' : 'declined', respondedAt: new Date() } : q,
          ),
        }));
      },
    }),
    {
      name: 'ustavia-mobile-jobs',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
