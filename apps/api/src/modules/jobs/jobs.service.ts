import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  assertValidJobStatusTransition,
  DEFAULT_FBR_WITHHOLDING_RATE_PERCENTAGE,
  DEFAULT_PLATFORM_CUT_PERCENTAGE,
  JOB_STATUSES,
  type DisputeCategory,
  type JobStatus,
} from '@ustavia/shared';

import { generateEntryPin } from '../../common/generate-pin';
import { haversineKm } from '../../common/geo/haversine';
import { WalletLedgerEntryEntity } from '../payments/entities/wallet-ledger-entry.entity';
import type { CreateJobDto } from './dto/create-job.dto';
import { DisputeEntity } from './entities/dispute.entity';
import { JobEntity } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobEntity) private readonly jobs: Repository<JobEntity>,
    @InjectRepository(DisputeEntity) private readonly disputes: Repository<DisputeEntity>,
    @InjectRepository(WalletLedgerEntryEntity) private readonly ledger: Repository<WalletLedgerEntryEntity>,
  ) {}

  create(customerId: string, dto: CreateJobDto): Promise<JobEntity> {
    const job = this.jobs.create({
      customerId,
      mazdoorId: null,
      status: 'posted',
      description: dto.description,
      photoUrls: dto.photoUrls ?? [],
      videoUrl: dto.videoUrl ?? null,
      location: dto.location,
      agreedPrice: null,
      agreedTime: null,
      entryPin: null,
      materialQuoteId: null,
      confirmedAt: null,
      startedAt: null,
      completedAt: null,
    });
    return this.jobs.save(job);
  }

  /** `mine`/`status` scope the list to the caller's own jobs; otherwise returns `posted` jobs only — area/distance, never a pinpoint address, ARCHITECTURE.md §5. `near` (a Mazdoor's own location) adds a computed `distanceKm` per row. */
  async list(opts: {
    userId: string;
    role: 'customer' | 'mazdoor';
    mine?: boolean;
    status?: string;
    near?: { latitude: number; longitude: number };
  }) {
    let jobs: JobEntity[];
    if (opts.mine) {
      jobs = await this.jobs.find({
        where: opts.role === 'customer' ? { customerId: opts.userId } : { mazdoorId: opts.userId },
        order: { createdAt: 'DESC' },
      });
    } else {
      const status: JobStatus = JOB_STATUSES.includes(opts.status as JobStatus) ? (opts.status as JobStatus) : 'posted';
      jobs = await this.jobs.find({ where: { status }, order: { createdAt: 'DESC' } });
    }

    if (!opts.near) return jobs;
    return jobs.map((job) => ({ ...job, distanceKm: haversineKm(opts.near!, job.location) }));
  }

  async findByIdOrThrow(id: string): Promise<JobEntity> {
    const job = await this.jobs.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async negotiate(jobId: string, mazdoorId: string): Promise<JobEntity> {
    const job = await this.findByIdOrThrow(jobId);
    assertValidJobStatusTransition(job.status, 'negotiating');
    job.status = 'negotiating';
    job.mazdoorId = mazdoorId;
    return this.jobs.save(job);
  }

  async proposeConfirmation(jobId: string, mazdoorId: string, price: number, time: Date): Promise<JobEntity> {
    const job = await this.findByIdOrThrow(jobId);
    if (job.mazdoorId !== mazdoorId) throw new ForbiddenException('Not the assigned Mazdoor for this job');
    if (job.status !== 'negotiating') throw new BadRequestException(`Cannot propose terms for a job in status "${job.status}"`);
    job.agreedPrice = price;
    job.agreedTime = time;
    return this.jobs.save(job);
  }

  async acceptConfirmation(jobId: string, customerId: string): Promise<JobEntity> {
    const job = await this.findByIdOrThrow(jobId);
    if (job.customerId !== customerId) throw new ForbiddenException('Not the customer for this job');
    assertValidJobStatusTransition(job.status, 'confirmed');
    job.status = 'confirmed';
    job.entryPin = generateEntryPin();
    job.confirmedAt = new Date();
    return this.jobs.save(job);
  }

  async start(jobId: string, mazdoorId: string, pin: string): Promise<JobEntity> {
    const job = await this.findByIdOrThrow(jobId);
    if (job.mazdoorId !== mazdoorId) throw new ForbiddenException('Not the assigned Mazdoor for this job');
    if (job.entryPin !== pin) throw new BadRequestException('Incorrect PIN');
    assertValidJobStatusTransition(job.status, 'in_progress');
    job.status = 'in_progress';
    job.startedAt = new Date();
    return this.jobs.save(job);
  }

  /** Both parties must independently ack before the job actually completes. */
  async markComplete(jobId: string, userId: string, actor: 'customer' | 'mazdoor'): Promise<JobEntity> {
    const job = await this.findByIdOrThrow(jobId);
    if (actor === 'customer' && job.customerId !== userId) throw new ForbiddenException('Not the customer for this job');
    if (actor === 'mazdoor' && job.mazdoorId !== userId) throw new ForbiddenException('Not the assigned Mazdoor for this job');
    if (job.status !== 'in_progress') throw new BadRequestException(`Cannot mark complete a job in status "${job.status}"`);

    if (actor === 'customer') job.customerAck = true;
    if (actor === 'mazdoor') job.mazdoorAck = true;

    if (job.customerAck && job.mazdoorAck) {
      assertValidJobStatusTransition('in_progress', 'completed');
      job.status = 'completed';
      job.completedAt = new Date();
    }
    return this.jobs.save(job);
  }

  /** Settles job_payout/platform_commission/fbr_withholding as one atomic append-only ledger write — ARCHITECTURE.md §4 `wallet_ledger`. */
  async pay(jobId: string, customerId: string): Promise<JobEntity> {
    const job = await this.findByIdOrThrow(jobId);
    if (job.customerId !== customerId) throw new ForbiddenException('Not the customer for this job');
    assertValidJobStatusTransition(job.status, 'paid');
    if (!job.mazdoorId || job.agreedPrice == null) {
      throw new BadRequestException('Cannot pay a job with no assigned Mazdoor or agreed price');
    }

    const commission = Math.round(job.agreedPrice * (DEFAULT_PLATFORM_CUT_PERCENTAGE / 100));
    const withholding = Math.round(job.agreedPrice * (DEFAULT_FBR_WITHHOLDING_RATE_PERCENTAGE / 100));

    await this.ledger.manager.transaction(async (trx) => {
      const entries = trx.create(WalletLedgerEntryEntity, [
        { mazdoorId: job.mazdoorId!, jobId: job.id, amount: job.agreedPrice!, type: 'job_payout' },
        { mazdoorId: job.mazdoorId!, jobId: job.id, amount: -commission, type: 'platform_commission' },
        { mazdoorId: job.mazdoorId!, jobId: job.id, amount: -withholding, type: 'fbr_withholding' },
      ]);
      await trx.save(entries);
      job.status = 'paid';
      await trx.save(job);
    });

    return job;
  }

  async raiseDispute(jobId: string, userId: string, category: DisputeCategory, details: string | null): Promise<DisputeEntity> {
    const job = await this.findByIdOrThrow(jobId);
    if (job.customerId !== userId && job.mazdoorId !== userId) {
      throw new ForbiddenException('Not a party to this job');
    }
    assertValidJobStatusTransition(job.status, 'disputed');

    const dispute = this.disputes.create({
      jobId,
      raisedBy: userId,
      category,
      details,
      status: 'open',
      resolutionNotes: null,
    });
    await this.disputes.save(dispute);
    job.status = 'disputed';
    await this.jobs.save(job);
    return dispute;
  }

  listDisputesForJob(jobId: string): Promise<DisputeEntity[]> {
    return this.disputes.find({ where: { jobId }, order: { createdAt: 'DESC' } });
  }
}
