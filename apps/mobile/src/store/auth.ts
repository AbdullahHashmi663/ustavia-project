import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MOCK_CUSTOMERS, MOCK_MAZDOORS, type UserRole, type VerificationStatus } from '@ustavia/shared';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: string | null;
  verificationStatus: VerificationStatus | null;
  setRole: (role: UserRole) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  completeAuth: () => void;
  logout: () => void;
}

/**
 * Role is chosen once at signup and is permanent for MVP — ARCHITECTURE.md
 * §2.1. There's no real login yet, so picking a role pins the session to one
 * fixed demo persona (the richest mock record for that role) so job/wallet
 * screens have something realistic to filter "for me".
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: null,
      userId: null,
      verificationStatus: null,
      setRole: (role) =>
        set({
          role,
          userId: role === 'mazdoor' ? MOCK_MAZDOORS[0].id : MOCK_CUSTOMERS[0].id,
        }),
      setVerificationStatus: (verificationStatus) => set({ verificationStatus }),
      completeAuth: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false, role: null, userId: null, verificationStatus: null }),
    }),
    {
      name: 'ustavia-mobile-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
