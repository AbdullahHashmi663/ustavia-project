import { z } from 'zod';

/** Drag-and-drop emergency job assignments for salaried staff — ARCHITECTURE.md §4. */
export const dispatchAssignmentSchema = z.object({
  id: z.string().uuid(),
  hrmMemberId: z.string().uuid(),
  jobId: z.string().uuid().nullable(),
  date: z.coerce.date(),
  notes: z.string().nullable(),
});

export type DispatchAssignment = z.infer<typeof dispatchAssignmentSchema>;
