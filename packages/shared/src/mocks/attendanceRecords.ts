import type { AttendanceRecord } from '../validation/attendanceRecord.schema';

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const STAFF_IDS = [
  '91111111-1111-4111-8111-111111111111',
  '92222222-2222-4222-8222-222222222222',
  '93333333-3333-4333-8333-333333333333',
];

const PATTERN: AttendanceRecord['status'][] = ['present', 'present', 'half_day', 'present', 'absent'];

export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = STAFF_IDS.flatMap((hrmMemberId, staffIndex) =>
  PATTERN.map((status, dayIndex) => ({
    id: `92${staffIndex}${dayIndex}0000-0000-4000-8000-000000000000`,
    hrmMemberId,
    date: daysAgo(PATTERN.length - dayIndex),
    status,
  })),
);
