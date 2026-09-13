import type { ChatMessage } from '../validation/chatMessage.schema';

const minutesAgo = (n: number) => new Date(Date.now() - n * 60 * 1000);

/** Conversation for job 002 (negotiating) — includes one redacted message as a demo of server-side filtering. */
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'd0000000-0000-4000-8000-000000000001',
    jobId: 'b0000000-0000-4000-8000-000000000002',
    senderId: 'c2222222-2222-4222-8222-222222222222',
    body: 'Hi, are you available this week for the ceiling fan installation?',
    redacted: false,
    createdAt: minutesAgo(40),
  },
  {
    id: 'd0000000-0000-4000-8000-000000000002',
    jobId: 'b0000000-0000-4000-8000-000000000002',
    senderId: 'a1111111-1111-4111-8111-111111111111',
    body: 'Yes, I can come Thursday afternoon. It will take about 2 hours for both fans.',
    redacted: false,
    createdAt: minutesAgo(35),
  },
  {
    id: 'd0000000-0000-4000-8000-000000000003',
    jobId: 'b0000000-0000-4000-8000-000000000002',
    senderId: 'c2222222-2222-4222-8222-222222222222',
    body: 'Sounds good. Call me on [redacted] to confirm the time.',
    redacted: true,
    createdAt: minutesAgo(30),
  },
];
