import { z } from 'zod';

export const ATTENDANCE_STATUSES = ['present', 'half_day', 'absent'] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const attendanceRecordSchema = z.object({
  id: z.string().uuid(),
  hrmMemberId: z.string().uuid(),
  date: z.coerce.date(),
  status: z.enum(ATTENDANCE_STATUSES),
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>;
