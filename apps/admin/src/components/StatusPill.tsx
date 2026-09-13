import type { JobStatus } from '@ustavia/shared';

import { Badge, type BadgeProps } from '@/components/ui/badge';

const JOB_STATUS_TONE: Record<JobStatus, NonNullable<BadgeProps['tone']>> = {
  posted: 'neutral',
  negotiating: 'info',
  confirmed: 'info',
  in_progress: 'info',
  completed: 'success',
  paid: 'success',
  disputed: 'danger',
};

export function JobStatusPill({ status }: { status: JobStatus }) {
  return <Badge tone={JOB_STATUS_TONE[status]}>{status.replace('_', ' ')}</Badge>;
}
