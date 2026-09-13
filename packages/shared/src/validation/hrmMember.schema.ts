import { z } from 'zod';

/** finance_head/ceo gate the Finance module (ARCHITECTURE.md §7); the rest are operational staff roles. */
export const HRM_ROLES = ['staff', 'dispatcher', 'hr', 'finance_head', 'ceo'] as const;

export type HrmRole = (typeof HRM_ROLES)[number];

export const hrmMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  role: z.enum(HRM_ROLES),
  email: z.string().email(),
  monthlyPay: z.number().nonnegative(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
});

export type HrmMember = z.infer<typeof hrmMemberSchema>;
