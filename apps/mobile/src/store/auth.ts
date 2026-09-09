import { create } from 'zustand';
import type { UserRole, VerificationStatus } from '@ustavia/shared';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  verificationStatus: VerificationStatus | null;
  setRole: (role: UserRole) => void;
  setVerificationStatus: (status: VerificationStatus) => void;
  completeAuth: () => void;
  logout: () => void;
}

/** Role is chosen once at signup and is permanent for MVP — ARCHITECTURE.md §2.1. */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  verificationStatus: null,
  setRole: (role) => set({ role }),
  setVerificationStatus: (verificationStatus) => set({ verificationStatus }),
  completeAuth: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, role: null, verificationStatus: null }),
}));
