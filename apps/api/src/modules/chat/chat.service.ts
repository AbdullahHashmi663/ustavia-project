import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { redactContactInfo } from '@ustavia/shared';

import { JobEntity } from '../jobs/entities/job.entity';
import { ChatMessageEntity } from './entities/chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity) private readonly messages: Repository<ChatMessageEntity>,
    @InjectRepository(JobEntity) private readonly jobs: Repository<JobEntity>,
  ) {}

  private async assertParty(jobId: string, userId: string): Promise<JobEntity> {
    const job = await this.jobs.findOne({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.customerId !== userId && job.mazdoorId !== userId) {
      throw new ForbiddenException('Not a party to this job');
    }
    return job;
  }

  async list(jobId: string, userId: string): Promise<ChatMessageEntity[]> {
    await this.assertParty(jobId, userId);
    return this.messages.find({ where: { jobId }, order: { createdAt: 'ASC' } });
  }

  /** Server-side redaction — ARCHITECTURE.md §7: numbers/emails are stripped before persisting or relaying, never shipped to the counterparty. */
  async send(jobId: string, senderId: string, body: string): Promise<ChatMessageEntity> {
    await this.assertParty(jobId, senderId);
    const { text, redacted } = redactContactInfo(body);
    const message = this.messages.create({ jobId, senderId, body: text, redacted });
    return this.messages.save(message);
  }
}
