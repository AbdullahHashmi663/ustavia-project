import { JobStatus } from './job-status.enum';

const ALLOWED_TRANSITIONS: Record<JobStatus, readonly JobStatus[]> = {
  [JobStatus.Posted]: [JobStatus.Negotiating],
  [JobStatus.Negotiating]: [JobStatus.Confirmed],
  [JobStatus.Confirmed]: [JobStatus.InProgress],
  [JobStatus.InProgress]: [JobStatus.Completed, JobStatus.Disputed],
  [JobStatus.Completed]: [JobStatus.Paid, JobStatus.Disputed],
  [JobStatus.Paid]: [],
  [JobStatus.Disputed]: [],
};

export class InvalidJobStatusTransitionError extends Error {
  constructor(
    public readonly from: JobStatus,
    public readonly to: JobStatus,
  ) {
    super(`Cannot transition job from "${from}" to "${to}"`);
    this.name = 'InvalidJobStatusTransitionError';
  }
}

/** Throws immediately on any transition not in ARCHITECTURE.md §5. No business logic beyond this check. */
export function assertValidJobStatusTransition(from: JobStatus, to: JobStatus): void {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new InvalidJobStatusTransitionError(from, to);
  }
}
