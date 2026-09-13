import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HealthModule } from './modules/health/health.module';
import { HrmModule } from './modules/hrm/hrm.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UsersModule } from './modules/users/users.module';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        // Hosted Postgres (e.g. Supabase's direct-connection host) requires TLS; rejectUnauthorized
        // is off because Supabase's cert chain isn't in Node's default trust store — see .env.example.
        ssl: config.get<string>('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        // Entities are registered per-module via TypeOrmModule.forFeature([...]); autoLoadEntities
        // picks those up automatically, so this stays empty rather than duplicating the list here
        // and in src/data-source.ts (the migration CLI's DataSource, which TypeORM's CLI requires
        // as a plain export — it can't consume Nest's DI-based module graph).
        entities: [],
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    JobsModule,
    ChatModule,
    PaymentsModule,
    VerificationModule,
    HrmModule,
    FinanceModule,
  ],
})
export class AppModule {}
