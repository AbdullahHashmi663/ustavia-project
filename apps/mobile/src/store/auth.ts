import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MOCK_CUSTOMERS, MOCK_MAZDOORS, type UserRole, type VerificationStatus } from '@ustavia/shared';

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
 * (`POST /auth/otp/verify`) as of the auth-wiring pass — phone OTP is now
 * genuinely checked server-side instead of accepting any 6 digits.
 *
 * `userId` is the one deliberate exception: `apps/mobile`'s job/wallet/chat
 * screens still all read from the local Zustand mock store (JobsModule etc.
 * aren't wired to the real API yet — see PLANNING.md's execution log), and
 * that mock data is keyed to the fixed `MOCK_MAZDOORS[0]`/`MOCK_CUSTOMERS[0]`
 * ids, not a real database UUID. Pinning `userId` to that same demo persona
 * (by role) instead of `user.id` keeps every already-working mock-data
 * screen working unchanged; swap this the same day the jobs store starts
 * calling the real API instead of reading mock fixtures.
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
          userId: user.role === 'mazdoor' ? MOCK_MAZDOORS[0].id : MOCK_CUSTOMERS[0].id,
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
