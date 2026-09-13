import { z } from 'zod';

export const MATERIAL_QUOTE_STATUSES = ['pending', 'approved', 'declined'] as const;

export type MaterialQuoteStatus = (typeof MATERIAL_QUOTE_STATUSES)[number];

/**
 * Mid-job material cost, raised by the Mazdoor after inspecting the site and
 * funded separately from the frozen labor price — docx "Finance" section:
 * "the app must allow the Mazdoor to generate a mid-job Material Quote that
 * the customer can approve and fund separately". `Job.materialQuoteId`
 * (job.schema.ts) points at the active one for that job.
 */
export const materialQuoteSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  description: z.string().min(1),
  amount: z.number().positive(),
  status: z.enum(MATERIAL_QUOTE_STATUSES),
  createdAt: z.coerce.date(),
  respondedAt: z.coerce.date().nullable(),
});

export type MaterialQuote = z.infer<typeof materialQuoteSchema>;
