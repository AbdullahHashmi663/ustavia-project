import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { DISPUTE_CATEGORIES, DISPUTE_STATUSES, type DisputeCategory, type DisputeStatus } from '@ustavia/shared';

/** ARCHITECTURE.md §4 `disputes`. Lives in the jobs module — disputes are a branch off the job state machine, not a standalone domain. */
@Entity('disputes')
export class DisputeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  jobId!: string;

  @Column({ type: 'uuid' })
  raisedBy!: string;

  @Column({ type: 'varchar', length: 32 })
  category!: DisputeCategory;

  @Column({ type: 'text', nullable: true })
  details!: string | null;

  @Column({ type: 'varchar', length: 16, default: 'open' })
  status!: DisputeStatus;

  @Column({ type: 'text', nullable: true })
  resolutionNotes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

export { DISPUTE_CATEGORIES, DISPUTE_STATUSES };
