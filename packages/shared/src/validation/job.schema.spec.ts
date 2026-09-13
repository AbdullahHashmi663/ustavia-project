import { JOB_STATUSES, assertValidJobStatusTransition, InvalidJobStatusTransitionError } from './job.schema';

describe('assertValidJobStatusTransition', () => {
  const validTransitions: Array<[(typeof JOB_STATUSES)[number], (typeof JOB_STATUSES)[number]]> = [
    ['posted', 'negotiating'],
    ['negotiating', 'confirmed'],
    ['confirmed', 'in_progress'],
    ['in_progress', 'completed'],
    ['in_progress', 'disputed'],
    ['completed', 'paid'],
    ['completed', 'disputed'],
  ];

  it.each(validTransitions)('allows %s -> %s', (from, to) => {
    expect(() => assertValidJobStatusTransition(from, to)).not.toThrow();
  });

  const invalidTransitions: Array<[(typeof JOB_STATUSES)[number], (typeof JOB_STATUSES)[number]]> = [
    ['posted', 'confirmed'],
    ['posted', 'in_progress'],
    ['negotiating', 'in_progress'],
    ['paid', 'posted'],
    ['disputed', 'completed'],
    ['completed', 'negotiating'],
  ];

  it.each(invalidTransitions)('throws on %s -> %s', (from, to) => {
    expect(() => assertValidJobStatusTransition(from, to)).toThrow(InvalidJobStatusTransitionError);
  });
});
