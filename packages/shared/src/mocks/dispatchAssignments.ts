import type { DispatchAssignment } from '../validation/dispatchAssignment.schema';

const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

export const MOCK_DISPATCH_ASSIGNMENTS: DispatchAssignment[] = [
  {
    id: '93000000-0000-4000-8000-000000000001',
    hrmMemberId: '92222222-2222-4222-8222-222222222222',
    jobId: 'b0000000-0000-4000-8000-000000000004',
    date: daysFromNow(0),
    notes: 'On-site supervision for the deep cleaning job.',
  },
  {
    id: '93000000-0000-4000-8000-000000000002',
    hrmMemberId: '91111111-1111-4111-8111-111111111111',
    jobId: 'b0000000-0000-4000-8000-000000000003',
    date: daysFromNow(1),
    notes: null,
  },
  {
    id: '93000000-0000-4000-8000-000000000003',
    hrmMemberId: '91111111-1111-4111-8111-111111111111',
    jobId: null,
    date: daysFromNow(2),
    notes: 'Available for emergency dispatch.',
  },
];
