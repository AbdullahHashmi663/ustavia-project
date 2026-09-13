import { z } from 'zod';

export const BANK_ACCOUNT_TYPES = ['savings', 'current'] as const;

export type BankAccountType = (typeof BANK_ACCOUNT_TYPES)[number];

/**
 * A Mazdoor's payout destination — Workers.pdf §8.4 "Add Bank Account Screen".
 * Only the last 4 digits are retained client-side, matching the redaction
 * pattern already used for phone/email in `redactContactInfo` — the full
 * account number is never round-tripped back from the server after entry.
 */
export const bankAccountSchema = z.object({
  id: z.string().uuid(),
  mazdoorId: z.string().uuid(),
  bankName: z.string().min(1),
  accountHolderName: z.string().min(1),
  accountNumberLast4: z.string().regex(/^\d{4}$/),
  accountType: z.enum(BANK_ACCOUNT_TYPES),
  isDefault: z.boolean(),
  createdAt: z.coerce.date(),
});

export type BankAccount = z.infer<typeof bankAccountSchema>;
