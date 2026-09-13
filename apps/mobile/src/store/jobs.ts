import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  assertValidJobStatusTransition,
  DEFAULT_FBR_WITHHOLDING_RATE_PERCENTAGE,
  DEFAULT_PLATFORM_CUT_PERCENTAGE,
  DEFAULT_WITHDRAWAL_FEE_PERCENTAGE,
  MOCK_BANK_ACCOUNTS,
  MOCK_CHAT_MESSAGES,
  MOCK_CUSTOMERS,
  MOCK_DISPUTES,
  MOCK_JOBS,
  MOCK_MATERIAL_QUOTES,
  MOCK_MAZDOORS,
  MOCK_SOS_ACTIVE_JOB_IDS,
  MOCK_WALLET_LEDGER,
  redactContactInfo,
  type BankAccount,
  type BankAccountType,
  type ChatMessage,
  type Customer,
  type Dispute,
  type DisputeCategory,
  type Job,
  type MaterialQuote,
  type Mazdoor,
  type WalletLedgerEntry,
} from '@ustavia/shared';

import { generateId, generatePin } from '../utils/id';

interface JobAcks {
  customerAck: boolean;
  mazdoorAck: boolean;
}

interface JobsState {
  jobs: Job[];
  chatMessages: ChatMessage[];
  walletLedger: WalletLedgerEntry[];
  disputes: Dispute[];
  mazdoors: Mazdoor[];
  customers: Customer[];
  bankAccounts: BankAccount[];
  materialQuotes: MaterialQuote[];
  sosActiveJobIds: string[];
  jobAcks: Record<string, JobAcks>;

  postJob: (input: { customerId: string; description: string }) => Job;
  startNegotiation: (jobId: string, mazdoorId: string) => void;
  sendChatMessage: (jobId: string, senderId: string, body: string) => void;
  proposeConfirmation: (jobId: string, price: number, time: Date) => void;
  acceptConfirmation: (jobId: string) => void;
  startJob: (jobId: string, enteredPin: string) => boolean;
  toggleSos: (jobId: string) => void;
  markComplete: (jobId: string, actor: 'customer' | 'mazdoor') => void;
  pay: (jobId: string) => void;
  raiseDispute: (jobId: string, raisedBy: string, category: DisputeCategory, details: string | null) => void;
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

function getJobOrThrow(jobs: Job[], jobId: string): Job {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) throw new Error(`Unknown job: ${jobId}`);
  return job;
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: MOCK_JOBS,
      chatMessages: MOCK_CHAT_MESSAGES,
      walletLedger: MOCK_WALLET_LEDGER,
      disputes: MOCK_DISPUTES,
      mazdoors: MOCK_MAZDOORS,
      customers: MOCK_CUSTOMERS,
      bankAccounts: MOCK_BANK_ACCOUNTS,
      materialQuotes: MOCK_MATERIAL_QUOTES,
      sosActiveJobIds: MOCK_SOS_ACTIVE_JOB_IDS,
      jobAcks: {},

      postJob: ({ customerId, description }) => {
        const newJob: Job = {
          id: generateId(),
          customerId,
          mazdoorId: null,
          status: 'posted',
          description,
          photoUrls: [],
          videoUrl: null,
          location: { latitude: 24.86 + (Math.random() - 0.5) * 0.05, longitude: 67.0 + (Math.random() - 0.5) * 0.05 },
          agreedPrice: null,
          agreedTime: null,
          entryPin: null,
          materialQuoteId: null,
          createdAt: new Date(),
          confirmedAt: null,
          startedAt: null,
          completedAt: null,
        };
        set((state) => ({ jobs: [newJob, ...state.jobs] }));
        return newJob;
      },

      startNegotiation: (jobId, mazdoorId) => {
        const job = getJobOrThrow(get().jobs, jobId);
        assertValidJobStatusTransition(job.status, 'negotiating');
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, status: 'negotiating', mazdoorId } : j)),
        }));
      },

      sendChatMessage: (jobId, senderId, body) => {
        getJobOrThrow(get().jobs, jobId);
        const { text, redacted } = redactContactInfo(body);
        const message: ChatMessage = {
          id: generateId(),
          jobId,
          senderId,
          body: text,
          redacted,
          createdAt: new Date(),
        };
        set((state) => ({ chatMessages: [...state.chatMessages, message] }));
      },

      proposeConfirmation: (jobId, price, time) => {
        const job = getJobOrThrow(get().jobs, jobId);
        if (job.status !== 'negotiating') {
          throw new Error(`Cannot propose terms for a job in status "${job.status}"`);
        }
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, agreedPrice: price, agreedTime: time } : j)),
        }));
      },

      acceptConfirmation: (jobId) => {
        const job = getJobOrThrow(get().jobs, jobId);
        assertValidJobStatusTransition(job.status, 'confirmed');
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status: 'confirmed', entryPin: generatePin(), confirmedAt: new Date() } : j,
          ),
        }));
      },

      startJob: (jobId, enteredPin) => {
        const job = getJobOrThrow(get().jobs, jobId);
        if (job.entryPin !== enteredPin) return false;
        assertValidJobStatusTransition(job.status, 'in_progress');
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, status: 'in_progress', startedAt: new Date() } : j)),
        }));
        return true;
      },

      toggleSos: (jobId) => {
        set((state) => ({
          sosActiveJobIds: state.sosActiveJobIds.includes(jobId)
            ? state.sosActiveJobIds.filter((id) => id !== jobId)
            : [...state.sosActiveJobIds, jobId],
        }));
      },

      markComplete: (jobId, actor) => {
        const job = getJobOrThrow(get().jobs, jobId);
        if (job.status !== 'in_progress') {
          throw new Error(`Cannot mark complete a job in status "${job.status}"`);
        }
        const current = get().jobAcks[jobId] ?? { customerAck: false, mazdoorAck: false };
        const nextAcks: JobAcks = {
          customerAck: actor === 'customer' ? true : current.customerAck,
          mazdoorAck: actor === 'mazdoor' ? true : current.mazdoorAck,
        };
        const bothAcked = nextAcks.customerAck && nextAcks.mazdoorAck;

        set((state) => ({
          jobAcks: { ...state.jobAcks, [jobId]: nextAcks },
          jobs: bothAcked
            ? state.jobs.map((j) => (j.id === jobId ? { ...j, status: 'completed', completedAt: new Date() } : j))
            : state.jobs,
        }));

        if (bothAcked) assertValidJobStatusTransition('in_progress', 'completed');
      },

      pay: (jobId) => {
        const job = getJobOrThrow(get().jobs, jobId);
        assertValidJobStatusTransition(job.status, 'paid');
        if (!job.mazdoorId || !job.agreedPrice) {
          throw new Error('Cannot pay a job with no assigned mazdoor or agreed price');
        }

        const commission = Math.round(job.agreedPrice * (DEFAULT_PLATFORM_CUT_PERCENTAGE / 100));
        const withholding = Math.round(job.agreedPrice * (DEFAULT_FBR_WITHHOLDING_RATE_PERCENTAGE / 100));
        const now = new Date();
        const newEntries: WalletLedgerEntry[] = [
          { id: generateId(), mazdoorId: job.mazdoorId, jobId, amount: job.agreedPrice, type: 'job_payout', createdAt: now },
          { id: generateId(), mazdoorId: job.mazdoorId, jobId, amount: -commission, type: 'platform_commission', createdAt: now },
          { id: generateId(), mazdoorId: job.mazdoorId, jobId, amount: -withholding, type: 'fbr_withholding', createdAt: now },
        ];

        set((state) => ({
          walletLedger: [...state.walletLedger, ...newEntries],
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, status: 'paid' } : j)),
        }));
      },

      raiseDispute: (jobId, raisedBy, category, details) => {
        const job = getJobOrThrow(get().jobs, jobId);
        assertValidJobStatusTransition(job.status, 'disputed');
        const dispute: Dispute = {
          id: generateId(),
          jobId,
          raisedBy,
          category,
          details,
          status: 'open',
          resolutionNotes: null,
          createdAt: new Date(),
        };
        set((state) => ({
          disputes: [...state.disputes, dispute],
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, status: 'disputed' } : j)),
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
        const job = getJobOrThrow(get().jobs, jobId);
        if (job.status !== 'in_progress') {
          throw new Error(`Cannot propose a material quote for a job in status "${job.status}"`);
        }
        const quote: MaterialQuote = {
          id: generateId(),
          jobId,
          description,
          amount,
          status: 'pending',
          createdAt: new Date(),
          respondedAt: null,
        };
        set((state) => ({
          materialQuotes: [...state.materialQuotes, quote],
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, materialQuoteId: quote.id } : j)),
        }));
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
