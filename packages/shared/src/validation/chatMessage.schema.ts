import { z } from 'zod';

export const chatMessageSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  senderId: z.string().uuid(),
  body: z.string().min(1),
  /** true if server-side filtering stripped a phone/email pattern. */
  redacted: z.boolean(),
  createdAt: z.coerce.date(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
