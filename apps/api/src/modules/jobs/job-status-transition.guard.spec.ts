import { JobStatus } from './job-status.enum';
import { assertValidJobStatusTransition, InvalidJobStatusTransitionError } from './job-status-transition.guard';

describe('assertValidJobStatusTransition', () => {
  const validTransitions: Array<[JobStatus, JobStatus]> = [
    [JobStatus.Posted, JobStatus.Negotiating],
    [JobStatus.Negotiating, JobStatus.Confirmed],
    [JobStatus.Confirmed, JobStatus.InProgress],
    [JobStatus.InProgress, JobStatus.Completed],
    [JobStatus.InProgress, JobStatus.Disputed],
    [JobStatus.Completed, JobStatus.Paid],
    [JobStatus.Completed, JobStatus.Disputed],
  ];

  it.each(validTransitions)('allows %s -> %s', (from, to) => {
    expect(() => assertValidJobStatusTransition(from, to)).not.toThrow();
  });

  const invalidTransitions: Array<[JobStatus, JobStatus]> = [
    [JobStatus.Posted, JobStatus.Confirmed],
    [JobStatus.Posted, JobStatus.InProgress],
    [JobStatus.Negotiating, JobStatus.InProgress],
    [JobStatus.Paid, JobStatus.Posted],
    [JobStatus.Disputed, JobStatus.Completed],
    [JobStatus.Completed, JobStatus.Negotiating],
  ];

  it.each(invalidTransitions)('throws on %s -> %s', (from, to) => {
    expect(() => assertValidJobStatusTransition(from, to)).toThrow(InvalidJobStatusTransitionError);
  });
});
