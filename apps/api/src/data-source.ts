import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

import { UserEntity } from './modules/users/entities/user.entity';
import { JobEntity } from './modules/jobs/entities/job.entity';
import { DisputeEntity } from './modules/jobs/entities/dispute.entity';
import { ChatMessageEntity } from './modules/chat/entities/chat-message.entity';
import { WalletLedgerEntryEntity } from './modules/payments/entities/wallet-ledger-entry.entity';

/**
 * CLI-only DataSource for `typeorm migration:generate` / `migration:run`
 * (see package.json scripts). The running app uses app.module.ts's
 * TypeOrmModule.forRootAsync instead — this file exists because the
 * TypeORM CLI needs a plain DataSource export, not a Nest module.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [UserEntity, JobEntity, DisputeEntity, ChatMessageEntity, WalletLedgerEntryEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
