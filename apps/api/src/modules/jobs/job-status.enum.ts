/** Mirrors JOB_STATUSES in packages/shared — see ARCHITECTURE.md §5. */
export enum JobStatus {
  Posted = 'posted',
  Negotiating = 'negotiating',
  Confirmed = 'confirmed',
  InProgress = 'in_progress',
  Completed = 'completed',
  Paid = 'paid',
  Disputed = 'disputed',
}
