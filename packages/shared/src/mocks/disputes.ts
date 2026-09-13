import type { Dispute } from '../validation/dispute.schema';

const hoursAgo = (n: number) => new Date(Date.now() - n * 60 * 60 * 1000);

export const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'f0000000-0000-4000-8000-000000000001',
    jobId: 'b0000000-0000-4000-8000-000000000007',
    raisedBy: 'c1111111-1111-4111-8111-111111111111',
    category: 'quality_issue',
    details: 'The landscaping was left half-finished and the lawn wasn’t re-turfed as agreed.',
    status: 'under_review',
    resolutionNotes: null,
    createdAt: hoursAgo(18),
  },
];
