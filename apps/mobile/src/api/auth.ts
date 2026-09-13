import type { MazdoorTier, UserRole, VerificationStatus } from '@ustavia/shared';

import { apiFetch } from './client';

/** Mirrors apps/api's UserEntity (the exact shape `POST /auth/otp/verify` returns as `user`). */
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
  createdAt: string;
  updatedAt: string;
}

interface RequestOtpResponse {
  /** Only present because no real SMS provider is wired up yet — apps/api's OtpService doc comment. Never present once one is. */
  devCode?: string;
  expiresInSeconds: number;
}

interface VerifyOtpResponse {
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
export function verifyOtp(phone: string, code: string, role: UserRole): Promise<VerifyOtpResponse> {
  return apiFetch<VerifyOtpResponse>('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code, role }),
  });
}

/** `POST /auth/otp/request` only accepts `+92XXXXXXXXXX` (apps/api's RequestOtpDto) — normalizes whatever the user typed (leading 0, spaces, etc.) into that form. */
export function normalizePakistaniPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  const local = digits.startsWith('92') ? digits.slice(2) : digits.startsWith('0') ? digits.slice(1) : digits;
  return `+92${local}`;
}
