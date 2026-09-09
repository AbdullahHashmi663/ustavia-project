import { z } from 'zod';

import { MAZDOOR_TIERS } from '../constants/tiers';
import { geoPointSchema } from './geoPoint.schema';

export const USER_ROLES = ['mazdoor', 'customer'] as const;
export const VERIFICATION_STATUSES = ['pending', 'verified', 'rejected'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

const userBaseSchema = z.object({
  id: z.string().uuid(),
  phone: z.string().regex(/^\+92\d{10}$/, 'Expected a Pakistan phone number in +92XXXXXXXXXX form'),
  cnicFrontUrl: z.string().url().nullable(),
  cnicBackUrl: z.string().url().nullable(),
  verificationStatus: z.enum(VERIFICATION_STATUSES),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const mazdoorSchema = userBaseSchema.extend({
  role: z.literal('mazdoor'),
  email: z.null(),
  workshopLocation: geoPointSchema.nullable(),
  ratingAvg: z.number().min(0).max(5).nullable(),
  tier: z.enum(MAZDOOR_TIERS).nullable(),
  walletBalance: z.number().nonnegative(),
});

export const customerSchema = userBaseSchema.extend({
  role: z.literal('customer'),
  email: z.string().email(),
  workshopLocation: z.null(),
  ratingAvg: z.null(),
  tier: z.null(),
  walletBalance: z.literal(0),
});

export const userSchema = z.discriminatedUnion('role', [mazdoorSchema, customerSchema]);

export type Mazdoor = z.infer<typeof mazdoorSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type User = z.infer<typeof userSchema>;
