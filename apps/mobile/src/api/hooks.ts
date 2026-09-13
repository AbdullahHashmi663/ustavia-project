import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DisputeCategory, JobStatus } from '@ustavia/shared';

import * as chatApi from './chat';
import * as jobsApi from './jobs';
import * as usersApi from './users';
import * as walletApi from './wallet';

/**
 * React Query hooks over apps/mobile's real API layer (src/api/jobs.ts,
 * chat.ts, users.ts) — the job lifecycle + chat, wired to apps/api for
 * real (PLANNING.md's execution log has the full story). Every mutation
 * invalidates the whole `jobs`/`chat` query space rather than patching the
 * cache precisely — simpler and safer at this scale than trying to hand-
 * merge every possible server-side side effect (e.g. `pay` also touches
 * the wallet ledger) into the client cache by hand.
 */

const jobsKey = ['jobs'] as const;
const jobListKey = (opts: { mine?: boolean; status?: JobStatus }) => [...jobsKey, 'list', opts] as const;
const jobDetailKey = (id: string) => [...jobsKey, 'detail', id] as const;
const jobDisputesKey = (id: string) => [...jobsKey, id, 'disputes'] as const;
const chatKey = (jobId: string) => ['chat', jobId] as const;
const publicProfileKey = (id: string) => ['users', id, 'public'] as const;

export function useJobsList(opts: { mine?: boolean; status?: JobStatus } = {}) {
  return useQuery({ queryKey: jobListKey(opts), queryFn: () => jobsApi.listJobs(opts) });
}

export function useJob(id: string | undefined) {
  return useQuery({ queryKey: jobDetailKey(id ?? ''), queryFn: () => jobsApi.getJob(id!), enabled: !!id });
}

export function useJobDisputes(id: string | undefined) {
  return useQuery({ queryKey: jobDisputesKey(id ?? ''), queryFn: () => jobsApi.listDisputes(id!), enabled: !!id });
}

/** Polled rather than pushed — no Socket.IO client wired up yet (ARCHITECTURE.md §2.4 is still just a plan). Good enough for a chat screen someone is actively looking at. */
export function useChatMessages(jobId: string | undefined) {
  return useQuery({
    queryKey: chatKey(jobId ?? ''),
    queryFn: () => chatApi.listMessages(jobId!),
    enabled: !!jobId,
    refetchInterval: 4000,
  });
}

/** Real balance — a real job's `pay` mutation actually settles into this ledger server-side now. Mazdoor-only, matches apps/api's PaymentsController.getMe. */
export function useWallet() {
  return useQuery({ queryKey: ['wallet', 'me'], queryFn: walletApi.getWallet });
}

export function usePublicProfile(id: string | null | undefined) {
  return useQuery({
    queryKey: publicProfileKey(id ?? ''),
    queryFn: () => usersApi.getPublicProfile(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // a rating/tier doesn't change mid-session; no need to refetch often
  });
}

function useJobsInvalidator() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: jobsKey });
}

export function useCreateJob() {
  const invalidate = useJobsInvalidator();
  return useMutation({
    mutationFn: (input: { description: string; location: { latitude: number; longitude: number } }) => jobsApi.createJob(input),
    onSuccess: invalidate,
  });
}

export function useNegotiateJob() {
  const invalidate = useJobsInvalidator();
  return useMutation({ mutationFn: (id: string) => jobsApi.negotiateJob(id), onSuccess: invalidate });
}

export function useProposeConfirmation() {
  const invalidate = useJobsInvalidator();
  return useMutation({
    mutationFn: ({ id, price, time }: { id: string; price: number; time: Date }) => jobsApi.proposeConfirmation(id, price, time),
    onSuccess: invalidate,
  });
}

export function useAcceptConfirmation() {
  const invalidate = useJobsInvalidator();
  return useMutation({ mutationFn: (id: string) => jobsApi.acceptConfirmation(id), onSuccess: invalidate });
}

export function useStartJob() {
  const invalidate = useJobsInvalidator();
  return useMutation({
    mutationFn: ({ id, pin }: { id: string; pin: string }) => jobsApi.startJob(id, pin),
    onSuccess: invalidate,
  });
}

export function useMarkComplete() {
  const invalidate = useJobsInvalidator();
  return useMutation({ mutationFn: (id: string) => jobsApi.markComplete(id), onSuccess: invalidate });
}

export function usePayJob() {
  const invalidate = useJobsInvalidator();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsApi.payJob(id),
    onSuccess: () => {
      invalidate();
      // `pay` settles real wallet_ledger entries server-side — refresh the Mazdoor's balance too.
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
  });
}

export function useRaiseDispute() {
  const invalidate = useJobsInvalidator();
  return useMutation({
    mutationFn: ({ id, category, details }: { id: string; category: DisputeCategory; details: string | null }) =>
      jobsApi.raiseDispute(id, category, details),
    onSuccess: invalidate,
  });
}

export function useSendMessage(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => chatApi.sendMessage(jobId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chatKey(jobId) }),
  });
}
