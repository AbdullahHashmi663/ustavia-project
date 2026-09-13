import type { MazdoorTier, UserRole, VerificationStatus } from '@ustavia/shared';

import { apiFetch } from './client';

/** Mirrors apps/api's `SafeUser` (`toSafeUser` in users.service.ts) — the shape every auth response's `user` field actually has. `passwordHash` never leaves the server; `passwordSet` tells the client whether "log in with password" is available for this account yet. */
export interface ApiUser {
  id: string;
  phone: string;
  role: UserRole;
  email: string | null;
  cnicFrontUrl: string | null;
  cnicBackUrl: string | null;
  verificationStatus: VerificationStatus;
  workshopLocation: { latitude: number; longitude: number } | null;
  ratingAvg: number | null;
  tier: MazdoorTier | null;
  walletBalance: number;
  passwordSet: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RequestOtpResponse {
  /** Only present because no real SMS provider is wired up yet — apps/api's OtpService doc comment. Never present once one is. */
  devCode?: string;
  expiresInSeconds: number;
}

interface AuthSessionResponse {
  accessToken: string;
  user: ApiUser;
}

export function requestOtp(phone: string): Promise<RequestOtpResponse> {
  return apiFetch<RequestOtpResponse>('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

/** `role` is only actually used the first time this phone is seen — apps/api's AuthService, ARCHITECTURE.md §2.1. */
export function verifyOtp(phone: string, code: string, role: UserRole): Promise<AuthSessionResponse> {
  return apiFetch<AuthSessionResponse>('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code, role }),
  });
}

/** Returning-user fast path — no OTP round trip. Only succeeds once the account has called `setPassword` at least once. */
export function loginWithPassword(phone: string, password: string): Promise<AuthSessionResponse> {
  return apiFetch<AuthSessionResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
}

/** Sets/changes the caller's own password — requires an existing session (JWT already attached by apiFetch). */
export function setPassword(password: string): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>('/auth/password', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

/** `POST /auth/otp/request` only accepts `+92XXXXXXXXXX` (apps/api's RequestOtpDto) — normalizes whatever the user typed (leading 0, spaces, etc.) into that form. */
export function normalizePakistaniPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  const local = digits.startsWith('92') ? digits.slice(2) : digits.startsWith('0') ? digits.slice(1) : digits;
  return `+92${local}`;
}
