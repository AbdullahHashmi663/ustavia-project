import { z } from 'zod';

import { DISPUTE_CATEGORIES } from '../constants/disputes';

export const DISPUTE_STATUSES = ['open', 'under_review', 'resolved', 'dismissed'] as const;

export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];

export const disputeSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  raisedBy: z.string().uuid(),
  category: z.enum(DISPUTE_CATEGORIES),
  /** Free-text "Describe what happened" — customer.pdf §12.2 Screen 2, optional. */
  details: z.string().nullable(),
  status: z.enum(DISPUTE_STATUSES),
  resolutionNotes: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export type Dispute = z.infer<typeof disputeSchema>;
