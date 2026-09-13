import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MAZDOOR_TIERS, USER_ROLES, VERIFICATION_STATUSES, type MazdoorTier, type UserRole, type VerificationStatus } from '@ustavia/shared';

/**
 * Single table for both roles — ARCHITECTURE.md §4 `users`.
 *
 * `workshopLocation`/job `location` are stored as plain {lat,lng} jsonb for
 * now rather than a true PostGIS geography column: this Supabase instance's
 * postgis extension hasn't been verified enabled yet (see ARCHITECTURE.md's
 * Hosting note), and no endpoint here needs a radius query yet. Migrating to
 * a geography column + GiST index is a follow-up once "workers near me"
 * matching is built, not a blocker for the CRUD layer below.
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 16 })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true })
  cnicFrontUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  cnicBackUrl!: string | null;

  @Column({ type: 'varchar', length: 16, default: 'pending' })
  verificationStatus!: VerificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  workshopLocation!: { latitude: number; longitude: number } | null;

  @Column({ type: 'real', nullable: true })
  ratingAvg!: number | null;

  @Column({ type: 'varchar', length: 16, nullable: true })
  tier!: MazdoorTier | null;

  @Column({ type: 'real', default: 0 })
  walletBalance!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export { USER_ROLES, VERIFICATION_STATUSES, MAZDOOR_TIERS };
