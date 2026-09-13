import type { BankAccount } from '../validation/bankAccount.schema';

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'd0000000-0000-4000-8000-000000000001',
    mazdoorId: 'a1111111-1111-4111-8111-111111111111',
    bankName: 'HBL',
    accountHolderName: 'Ahmed Raza',
    accountNumberLast4: '2891',
    accountType: 'savings',
    isDefault: true,
    createdAt: daysAgo(60),
  },
];
