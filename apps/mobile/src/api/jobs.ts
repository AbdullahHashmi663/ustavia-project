import type { Dispute, DisputeCategory, Job, JobStatus } from '@ustavia/shared';

import { apiFetch } from './client';

/**
 * The wire shape of a job from apps/api. Almost identical to `@ustavia/shared`'s
 * `Job` type (same field names — apps/api's JobEntity was built to mirror
 * it), plus `customerAck`/`mazdoorAck` (real DB columns that aren't part of
 * the shared `jobSchema`, so they'd be silently stripped by a zod `.parse()`
 * — parsed by hand below instead) and date fields that arrive as ISO
 * strings over JSON, not `Date` instances.
 */
export type ApiJob = Job & { customerAck: boolean; mazdoorAck: boolean; distanceKm?: number };

const JOB_DATE_FIELDS = ['createdAt', 'confirmedAt', 'startedAt', 'completedAt'] as const;

function parseJob(raw: Record<string, unknown>): ApiJob {
  const job = { ...raw } as Record<string, unknown>;
  for (const field of JOB_DATE_FIELDS) {
    if (job[field]) job[field] = new Date(job[field] as string);
  }
  if (job.agreedTime) job.agreedTime = new Date(job.agreedTime as string);
  return job as unknown as ApiJob;
}

function parseDispute(raw: Record<string, unknown>): Dispute {
  return { ...raw, createdAt: new Date(raw.createdAt as string) } as unknown as Dispute;
}

export function createJob(input: {
  description: string;
  location: { latitude: number; longitude: number };
}): Promise<ApiJob> {
  // photoUrls/videoUrl are deliberately omitted: CreateJobDto requires real
  // URLs (@IsUrl) and there's no upload endpoint yet to turn a locally-
  // picked photo into one — same gap as CNIC upload (ARCHITECTURE.md).
  return apiFetch<Record<string, unknown>>('/jobs', { method: 'POST', body: JSON.stringify(input) }).then(parseJob);
}

export function listJobs(opts: { mine?: boolean; status?: JobStatus } = {}): Promise<ApiJob[]> {
  const params = new URLSearchParams();
  if (opts.mine) params.set('mine', 'true');
  if (opts.status) params.set('status', opts.status);
  const qs = params.toString();
  return apiFetch<Record<string, unknown>[]>(`/jobs${qs ? `?${qs}` : ''}`).then((rows) => rows.map(parseJob));
}

export function getJob(id: string): Promise<ApiJob> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}`).then(parseJob);
}

export function negotiateJob(id: string): Promise<ApiJob> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}/negotiate`, { method: 'POST' }).then(parseJob);
}

export function proposeConfirmation(id: string, price: number, time: Date): Promise<ApiJob> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}/propose`, {
    method: 'POST',
    body: JSON.stringify({ price, time: time.toISOString() }),
  }).then(parseJob);
}

export function acceptConfirmation(id: string): Promise<ApiJob> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}/confirm`, { method: 'POST' }).then(parseJob);
}

export function startJob(id: string, pin: string): Promise<ApiJob> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}/start`, {
    method: 'POST',
    body: JSON.stringify({ pin }),
  }).then(parseJob);
}

export function markComplete(id: string): Promise<ApiJob> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}/complete`, { method: 'POST' }).then(parseJob);
}

export function payJob(id: string): Promise<ApiJob> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}/pay`, { method: 'POST' }).then(parseJob);
}

export function raiseDispute(id: string, category: DisputeCategory, details: string | null): Promise<Dispute> {
  return apiFetch<Record<string, unknown>>(`/jobs/${id}/dispute`, {
    method: 'POST',
    body: JSON.stringify({ category, details: details ?? undefined }),
  }).then(parseDispute);
}

export function listDisputes(jobId: string): Promise<Dispute[]> {
  return apiFetch<Record<string, unknown>[]>(`/jobs/${jobId}/disputes`).then((rows) => rows.map(parseDispute));
}
