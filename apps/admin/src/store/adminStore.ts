import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MOCK_ATTENDANCE_RECORDS,
  MOCK_CHAT_MESSAGES,
  MOCK_CUSTOMERS,
  MOCK_DISPATCH_ASSIGNMENTS,
  MOCK_DISPUTES,
  MOCK_HRM_MEMBERS,
  MOCK_JOBS,
  MOCK_MAZDOORS,
  MOCK_SOS_ACTIVE_JOB_IDS,
  MOCK_WALLET_LEDGER,
  type AttendanceRecord,
  type ChatMessage,
  type Customer,
  type DispatchAssignment,
  type Dispute,
  type DisputeStatus,
  type HrmMember,
  type Job,
  type Mazdoor,
  type VerificationStatus,
  type WalletLedgerEntry,
} from '@ustavia/shared';

interface AdminState {
  jobs: Job[];
  mazdoors: Mazdoor[];
  customers: Customer[];
  chatMessages: ChatMessage[];
  walletLedger: WalletLedgerEntry[];
  disputes: Dispute[];
  hrmMembers: HrmMember[];
  attendanceRecords: AttendanceRecord[];
  dispatchAssignments: DispatchAssignment[];
  sosActiveJobIds: string[];

  setMazdoorVerification: (mazdoorId: string, status: VerificationStatus) => void;
  acknowledgeSos: (jobId: string) => void;
  resolveDispute: (disputeId: string, status: DisputeStatus, resolutionNotes: string) => void;
  moveDispatchAssignment: (assignmentId: string, newDate: Date) => void;
}

/**
 * Same mock fixtures as apps/mobile, but this is a separate persisted store
 * in a separate process — there's no live sync between the two apps until
 * the real backend + Socket.IO exist. Each app's demo is internally
 * consistent on its own.
 */
export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      jobs: MOCK_JOBS,
      mazdoors: MOCK_MAZDOORS,
      customers: MOCK_CUSTOMERS,
      chatMessages: MOCK_CHAT_MESSAGES,
      walletLedger: MOCK_WALLET_LEDGER,
      disputes: MOCK_DISPUTES,
      hrmMembers: MOCK_HRM_MEMBERS,
      attendanceRecords: MOCK_ATTENDANCE_RECORDS,
      dispatchAssignments: MOCK_DISPATCH_ASSIGNMENTS,
      sosActiveJobIds: MOCK_SOS_ACTIVE_JOB_IDS,

      setMazdoorVerification: (mazdoorId, status) =>
        set((state) => ({
          mazdoors: state.mazdoors.map((m) => (m.id === mazdoorId ? { ...m, verificationStatus: status } : m)),
        })),

      acknowledgeSos: (jobId) =>
        set((state) => ({ sosActiveJobIds: state.sosActiveJobIds.filter((id) => id !== jobId) })),

      resolveDispute: (disputeId, status, resolutionNotes) =>
        set((state) => ({
          disputes: state.disputes.map((d) => (d.id === disputeId ? { ...d, status, resolutionNotes } : d)),
        })),

      moveDispatchAssignment: (assignmentId, newDate) =>
        set((state) => ({
          dispatchAssignments: state.dispatchAssignments.map((a) =>
            a.id === assignmentId ? { ...a, date: newDate } : a,
          ),
        })),
    }),
    { name: 'ustavia-admin-store' },
  ),
);
