import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1789314010972 implements MigrationInterface {
    name = 'InitSchema1789314010972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying(20) NOT NULL, "role" character varying(16) NOT NULL, "email" character varying, "cnicFrontUrl" character varying, "cnicBackUrl" character varying, "verificationStatus" character varying(16) NOT NULL DEFAULT 'pending', "workshopLocation" jsonb, "ratingAvg" real, "tier" character varying(16), "walletBalance" real NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a000cca60bcf04454e72769949" ON "users" ("phone") `);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" uuid NOT NULL, "mazdoorId" uuid, "status" character varying(16) NOT NULL DEFAULT 'posted', "description" text NOT NULL, "photoUrls" jsonb NOT NULL DEFAULT '[]', "videoUrl" character varying, "location" jsonb NOT NULL, "agreedPrice" real, "agreedTime" TIMESTAMP WITH TIME ZONE, "entryPin" character varying(4), "materialQuoteId" uuid, "customerAck" boolean NOT NULL DEFAULT false, "mazdoorAck" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "confirmedAt" TIMESTAMP WITH TIME ZONE, "startedAt" TIMESTAMP WITH TIME ZONE, "completedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_15be39eec1b46b46690fd5460d" ON "jobs" ("customerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a1aad26aa7af5a33e769eafcf" ON "jobs" ("mazdoorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0c30e3eb9649fe7fbcd336a63" ON "jobs" ("status") `);
        await queryRunner.query(`CREATE TABLE "disputes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobId" uuid NOT NULL, "raisedBy" uuid NOT NULL, "category" character varying(32) NOT NULL, "details" text, "status" character varying(16) NOT NULL DEFAULT 'open', "resolutionNotes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c97580d01c1a4b0b345c42a107" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d424abda2f57327eb459d23d51" ON "disputes" ("jobId") `);
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobId" uuid NOT NULL, "senderId" uuid NOT NULL, "body" text NOT NULL, "redacted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cf667f9e46e95aebee819c7327" ON "chat_messages" ("jobId") `);
        await queryRunner.query(`CREATE TABLE "wallet_ledger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mazdoorId" uuid NOT NULL, "jobId" uuid, "amount" real NOT NULL, "type" character varying(32) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d925214b1961738af45cc6959af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df55134d397ad5ff7579baedcd" ON "wallet_ledger" ("mazdoorId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_df55134d397ad5ff7579baedcd"`);
        await queryRunner.query(`DROP TABLE "wallet_ledger"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf667f9e46e95aebee819c7327"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d424abda2f57327eb459d23d51"`);
        await queryRunner.query(`DROP TABLE "disputes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0c30e3eb9649fe7fbcd336a63"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a1aad26aa7af5a33e769eafcf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15be39eec1b46b46690fd5460d"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a000cca60bcf04454e72769949"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
