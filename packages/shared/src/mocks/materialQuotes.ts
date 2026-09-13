import type { MaterialQuote } from '../validation/materialQuote.schema';

const hoursAgo = (n: number) => new Date(Date.now() - n * 60 * 60 * 1000);

/** Attached to MOCK_JOBS' in_progress job (...004) via its materialQuoteId. */
export const MOCK_MATERIAL_QUOTES: MaterialQuote[] = [
  {
    id: 'g0000000-0000-4000-8000-000000000001',
    jobId: 'b0000000-0000-4000-8000-000000000004',
    description: 'Extra cleaning supplies (industrial degreaser, mop heads)',
    amount: 850,
    status: 'pending',
    createdAt: hoursAgo(1),
    respondedAt: null,
  },
];
