export const DISPUTE_CATEGORIES = [
  'property_damage',
  'tardiness',
  'harassment',
  'payment_issue',
  'quality_issue',
  'no_show',
  'other',
] as const;

export type DisputeCategory = (typeof DISPUTE_CATEGORIES)[number];
