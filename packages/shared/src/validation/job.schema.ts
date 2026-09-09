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
