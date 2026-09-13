import type { HrmMember } from '../validation/hrmMember.schema';

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export const MOCK_HRM_MEMBERS: HrmMember[] = [
  {
    id: '91111111-1111-4111-8111-111111111111',
    name: 'Sana Malik',
    role: 'staff',
    email: 'sana.malik@ustavia.pk',
    monthlyPay: 45000,
    isActive: true,
    createdAt: daysAgo(300),
  },
  {
    id: '92222222-2222-4222-8222-222222222222',
    name: 'Usman Tariq',
    role: 'dispatcher',
    email: 'usman.tariq@ustavia.pk',
    monthlyPay: 60000,
    isActive: true,
    createdAt: daysAgo(400),
  },
  {
    id: '93333333-3333-4333-8333-333333333333',
    name: 'Farah Zaidi',
    role: 'hr',
    email: 'farah.zaidi@ustavia.pk',
    monthlyPay: 70000,
    isActive: true,
    createdAt: daysAgo(500),
  },
  {
    id: '94444444-4444-4444-8444-444444444444',
    name: 'Imran Qureshi',
    role: 'finance_head',
    email: 'imran.qureshi@ustavia.pk',
    monthlyPay: 150000,
    isActive: true,
    createdAt: daysAgo(600),
  },
  {
    id: '95555555-5555-4555-8555-555555555555',
    name: 'Zara Sheikh',
    role: 'ceo',
    email: 'zara.sheikh@ustavia.pk',
    monthlyPay: 300000,
    isActive: true,
    createdAt: daysAgo(700),
  },
];
