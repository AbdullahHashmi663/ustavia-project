import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SessionState {
  /** The API issues a single long-lived JWT per `POST /auth/otp/verify` — no refresh token exists server-side yet. */
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAccessToken: () => set({ accessToken: null }),
    }),
    {
      name: 'ustavia-mobile-session',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
