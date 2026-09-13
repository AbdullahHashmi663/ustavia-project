import type { ChatMessage } from '@ustavia/shared';

import { apiFetch } from './client';

function parseMessage(raw: Record<string, unknown>): ChatMessage {
  return { ...raw, createdAt: new Date(raw.createdAt as string) } as unknown as ChatMessage;
}

export function listMessages(jobId: string): Promise<ChatMessage[]> {
  return apiFetch<Record<string, unknown>[]>(`/jobs/${jobId}/chat`).then((rows) => rows.map(parseMessage));
}

export function sendMessage(jobId: string, body: string): Promise<ChatMessage> {
  return apiFetch<Record<string, unknown>>(`/jobs/${jobId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  }).then(parseMessage);
}
