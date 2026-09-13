import type { MazdoorTier, UserRole, VerificationStatus } from '@ustavia/shared';

import { apiFetch } from './client';

/** The safe subset apps/api's `GET /users/:id/public` returns — no phone/email/CNIC, ARCHITECTURE.md §7. */
export interface PublicProfile {
  id: string;
  role: UserRole;
  ratingAvg: number | null;
  tier: MazdoorTier | null;
  verificationStatus: VerificationStatus;
}

export function getPublicProfile(id: string): Promise<PublicProfile> {
  return apiFetch<PublicProfile>(`/users/${id}/public`);
}
