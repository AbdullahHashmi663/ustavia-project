import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { JOB_STATUSES, type JobStatus } from '@ustavia/shared';

/** Job lifecycle — ARCHITECTURE.md §4 `jobs`, §5 state machine. */
@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  customerId!: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  mazdoorId!: string | null;

  @Index()
  @Column({ type: 'varchar', length: 16, default: 'posted' })
  status!: JobStatus;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  photoUrls!: string[];

  @Column({ type: 'varchar', nullable: true })
  videoUrl!: string | null;

  @Column({ type: 'jsonb' })
  location!: { latitude: number; longitude: number };

  @Column({ type: 'real', nullable: true })
  agreedPrice!: number | null;

  @Column({ type: 'timestamptz', nullable: true })
  agreedTime!: Date | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  entryPin!: string | null;

  @Column({ type: 'uuid', nullable: true })
  materialQuoteId!: string | null;

  /** Dual-acknowledgement completion — both parties must independently confirm before completedAt is set. Mirrors apps/mobile's local jobAcks tracking. */
  @Column({ type: 'boolean', default: false })
  customerAck!: boolean;

  @Column({ type: 'boolean', default: false })
  mazdoorAck!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt!: Date | null;
}

export { JOB_STATUSES };
