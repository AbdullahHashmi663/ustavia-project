import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordHash1789322357788 implements MigrationInterface {
    name = 'AddPasswordHash1789322357788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordHash" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordHash"`);
    }

}
