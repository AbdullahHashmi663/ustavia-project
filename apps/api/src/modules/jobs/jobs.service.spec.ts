import { randomUUID } from 'crypto';

import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DEFAULT_FBR_WITHHOLDING_RATE_PERCENTAGE, DEFAULT_PLATFORM_CUT_PERCENTAGE } from '@ustavia/shared';

import { JobsService } from './jobs.service';
import type { JobEntity } from './entities/job.entity';

/**
 * Minimal fake standing in for TypeORM's `Repository<T>` — just enough
 * surface (`create`, `save`, `find`, `findOne`, `manager.transaction`) for
 * JobsService's own logic to run against, without a live database. The
 * job lifecycle state machine and the payment settlement math (the most
 * safety-critical new backend code — ARCHITECTURE.md §5/§4) are what this
 * file actually protects; TypeORM's own query building is out of scope.
 */
function fakeRepo<T extends { id?: string }>() {
  const rows = new Map<string, T>();
  const repo = {
    rows,
    // A real UUID (not a per-repo counter) matters here: `pay()` below
    // saves both a JobEntity and several WalletLedgerEntryEntity rows
    // through the same fake `manager.transaction`, and a shared Map keyed
    // by a counter that resets per repo would let a job's "id-1" collide
    // with a ledger entry's "id-1" and silently clobber it.
    create: (data: Partial<T>): T => ({ id: data.id ?? randomUUID(), ...data }) as T,
    save: async (entity: T | T[]): Promise<T | T[]> => {
      const list = Array.isArray(entity) ? entity : [entity];
      for (const e of list) rows.set((e as { id: string }).id, e);
      return entity;
    },
    find: async (query?: { where?: Partial<T> }): Promise<T[]> => {
      const all = [...rows.values()];
      if (!query?.where) return all;
      return all.filter((row) => Object.entries(query.where!).every(([k, v]) => (row as Record<string, unknown>)[k] === v));
    },
    findOne: async (query: { where: Partial<T> }): Promise<T | null> => {
      const all = [...rows.values()];
      return all.find((row) => Object.entries(query.where).every(([k, v]) => (row as Record<string, unknown>)[k] === v)) ?? null;
    },
    manager: {
      // Real code calls `this.ledger.manager.transaction(async (trx) => ...)`
      // where `trx` is a TypeORM `EntityManager` — `create(EntityClass, data)`,
      // not a `Repository`'s single-arg `create(data)`. Fake that shape.
      transaction: async (
        fn: (trx: { create: (_cls: unknown, data: T | T[]) => T | T[]; save: (e: T | T[]) => Promise<T | T[]> }) => Promise<void>,
      ) =>
        fn({
          create: (_cls: unknown, data: T | T[]) =>
            Array.isArray(data) ? data.map((d) => repo.create(d)) : repo.create(data),
          save: repo.save,
        }),
    },
  };
  return repo;
}

describe('JobsService', () => {
  let jobsRepo: ReturnType<typeof fakeRepo<JobEntity>>;
  let ledgerRepo: ReturnType<typeof fakeRepo>;
  let service: JobsService;
  const CUSTOMER = 'customer-1';
  const MAZDOOR = 'mazdoor-1';

  beforeEach(() => {
    jobsRepo = fakeRepo<JobEntity>();
    const disputesRepo = fakeRepo();
    ledgerRepo = fakeRepo();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fakes stand in for TypeORM `Repository<T>` here.
    service = new JobsService(jobsRepo as any, disputesRepo as any, ledgerRepo as any);
  });

  async function postedJob() {
    return service.create(CUSTOMER, { description: 'Fix a leaking tap', location: { latitude: 24.86, longitude: 67.01 } });
  }

  it('walks the full lifecycle: posted -> negotiating -> confirmed -> in_progress -> completed -> paid', async () => {
    const job = await postedJob();
    expect(job.status).toBe('posted');

    await service.negotiate(job.id, MAZDOOR);
    await service.proposeConfirmation(job.id, MAZDOOR, 1500, new Date('2026-09-20T10:00:00.000Z'));
    const confirmed = await service.acceptConfirmation(job.id, CUSTOMER);
    expect(confirmed.status).toBe('confirmed');
    expect(confirmed.entryPin).toMatch(/^\d{4}$/);

    const started = await service.start(job.id, MAZDOOR, confirmed.entryPin!);
    expect(started.status).toBe('in_progress');

    const halfAck = await service.markComplete(job.id, CUSTOMER, 'customer');
    expect(halfAck.status).toBe('in_progress'); // only one side acked so far

    const fullyAcked = await service.markComplete(job.id, MAZDOOR, 'mazdoor');
    expect(fullyAcked.status).toBe('completed');

    const paid = await service.pay(job.id, CUSTOMER);
    expect(paid.status).toBe('paid');
  });

  it('rejects starting a job with the wrong PIN', async () => {
    const job = await postedJob();
    await service.negotiate(job.id, MAZDOOR);
    await service.proposeConfirmation(job.id, MAZDOOR, 1500, new Date());
    await service.acceptConfirmation(job.id, CUSTOMER);

    await expect(service.start(job.id, MAZDOOR, '0000')).rejects.toThrow(BadRequestException);
  });

  it('rejects a Mazdoor who is not assigned to the job from proposing terms', async () => {
    const job = await postedJob();
    await service.negotiate(job.id, MAZDOOR);
    await expect(service.proposeConfirmation(job.id, 'someone-else', 1500, new Date())).rejects.toThrow(ForbiddenException);
  });

  it('settles payment with the exact platform-commission and FBR-withholding split', async () => {
    const job = await postedJob();
    await service.negotiate(job.id, MAZDOOR);
    const price = 2000;
    await service.proposeConfirmation(job.id, MAZDOOR, price, new Date());
    const confirmed = await service.acceptConfirmation(job.id, CUSTOMER);
    await service.start(job.id, MAZDOOR, confirmed.entryPin!);
    await service.markComplete(job.id, CUSTOMER, 'customer');
    await service.markComplete(job.id, MAZDOOR, 'mazdoor');
    await service.pay(job.id, CUSTOMER);

    const expectedCommission = Math.round(price * (DEFAULT_PLATFORM_CUT_PERCENTAGE / 100));
    const expectedWithholding = Math.round(price * (DEFAULT_FBR_WITHHOLDING_RATE_PERCENTAGE / 100));

    const entries = (await ledgerRepo.find()) as { type: string; amount: number }[];
    const amounts = entries.map((e) => [e.type, e.amount]);
    expect(amounts).toEqual(
      expect.arrayContaining([
        ['job_payout', price],
        ['platform_commission', -expectedCommission],
        ['fbr_withholding', -expectedWithholding],
      ]),
    );
  });

  it('refuses to pay before the job is completed', async () => {
    const job = await postedJob();
    await expect(service.pay(job.id, CUSTOMER)).rejects.toThrow();
  });

  it('refuses to pay when someone other than the customer calls it', async () => {
    const job = await postedJob();
    await service.negotiate(job.id, MAZDOOR);
    await service.proposeConfirmation(job.id, MAZDOOR, 1000, new Date());
    const confirmed = await service.acceptConfirmation(job.id, CUSTOMER);
    await service.start(job.id, MAZDOOR, confirmed.entryPin!);
    await service.markComplete(job.id, CUSTOMER, 'customer');
    await service.markComplete(job.id, MAZDOOR, 'mazdoor');

    await expect(service.pay(job.id, 'someone-else')).rejects.toThrow(ForbiddenException);
  });
});
