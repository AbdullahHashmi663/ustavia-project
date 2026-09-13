import { z } from 'zod';

import { geoPointSchema } from './geoPoint.schema';

/**
 * Full lifecycle from ARCHITECTURE.md §5. `disputed` can branch off
 * `in_progress` or `completed`; every other edge is linear.
 */
export const JOB_STATUSES = [
  'posted',
  'negotiating',
  'confirmed',
  'in_progress',
  'completed',
  'paid',
  'disputed',
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const jobSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  mazdoorId: z.string().uuid().nullable(),
  status: z.enum(JOB_STATUSES),
  description: z.string().min(1),
  photoUrls: z.array(z.string().url()),
  videoUrl: z.string().url().nullable(),
  location: geoPointSchema,
  agreedPrice: z.number().positive().nullable(),
  agreedTime: z.coerce.date().nullable(),
  entryPin: z
    .string()
    .regex(/^\d{4}$/)
    .nullable(),
  materialQuoteId: z.string().uuid().nullable(),
  createdAt: z.coerce.date(),
  confirmedAt: z.coerce.date().nullable(),
  startedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),
});

export type Job = z.infer<typeof jobSchema>;

const ALLOWED_JOB_STATUS_TRANSITIONS: Record<JobStatus, readonly JobStatus[]> = {
  posted: ['negotiating'],
  negotiating: ['confirmed'],
  confirmed: ['in_progress'],
  in_progress: ['completed', 'disputed'],
  completed: ['paid', 'disputed'],
  paid: [],
  disputed: [],
};

export class InvalidJobStatusTransitionError extends Error {
  readonly from: JobStatus;
  readonly to: JobStatus;

  constructor(from: JobStatus, to: JobStatus) {
    super(`Cannot transition job from "${from}" to "${to}"`);
    this.name = 'InvalidJobStatusTransitionError';
    this.from = from;
    this.to = to;
  }
}

/** Throws immediately on any transition outside ARCHITECTURE.md §5. Single source of truth for apps/api and the mobile mock store. */
export function assertValidJobStatusTransition(from: JobStatus, to: JobStatus): void {
  if (!ALLOWED_JOB_STATUS_TRANSITIONS[from].includes(to)) {
    throw new InvalidJobStatusTransitionError(from, to);
  }
}
