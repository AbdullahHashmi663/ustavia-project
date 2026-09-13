import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserRole, VerificationStatus } from '@ustavia/shared';

import type { ApiUser } from '../api/auth';
import { useSessionStore } from './session';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
  phone: string | null;
  verificationStatus: VerificationStatus | null;
  /** Set from `POST /auth/otp/verify`'s response — the source of truth for everything above. */
  setUser: (user: ApiUser) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  completeAuth: () => void;
  logout: () => void;
}

/**
 * Role is chosen once at signup and is permanent for MVP — ARCHITECTURE.md
 * §2.1. `setUser` is populated from the real `apps/api` response
 * (`POST /auth/otp/verify`) — phone OTP is genuinely checked server-side.
 *
 * `userId` is the real database UUID as of the job-lifecycle wiring pass
 * (previously bridged to a fixed `MOCK_MAZDOORS[0]`/`MOCK_CUSTOMERS[0]`
 * demo persona so the then-still-mock job screens kept working — see
 * PLANNING.md's execution log). Now that `src/store/jobs.ts`'s job/chat
 * data comes from the real API, the real id is what job/chat responses
 * actually key `customerId`/`mazdoorId`/`senderId` to. The remaining mock
 * corners (bank accounts, material quotes, wallet withdrawal — no backend
 * endpoints exist yet) are self-contained and key off this same real id
 * consistently, so they keep working; they just no longer show the old
 * fixtures' pre-seeded demo data, since nobody is ever "logged in as"
 * that fixed persona anymore.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userId: null,
      phone: null,
      verificationStatus: null,
      setUser: (user) =>
        set({
          role: user.role,
          userId: user.id,
          phone: user.phone,
          verificationStatus: user.verificationStatus,
          // A returning user who already cleared verification skips the
          // KYC/pending screens entirely — see RolePickerScreen.
          isAuthenticated: user.verificationStatus === 'verified',
        }),
      setVerificationStatus: (verificationStatus) => set({ verificationStatus }),
      completeAuth: () => set({ isAuthenticated: true }),
      logout: () => {
        useSessionStore.getState().clearAccessToken();
        set({ isAuthenticated: false, role: null, userId: null, phone: null, verificationStatus: null });
      },
    }),
    {
      name: 'ustavia-mobile-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
