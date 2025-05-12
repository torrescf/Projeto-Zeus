import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1683900000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "member" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "project" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "description" TEXT,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "client" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "budget" (
                "id" SERIAL PRIMARY KEY,
                "amount" NUMERIC NOT NULL,
                "project_id" INT REFERENCES "project"("id") ON DELETE CASCADE,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "budget_history" (
                "id" SERIAL PRIMARY KEY,
                "budget_id" INT REFERENCES "budget"("id") ON DELETE CASCADE,
                "change_description" TEXT NOT NULL,
                "created_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "penalty" (
                "id" SERIAL PRIMARY KEY,
                "description" TEXT NOT NULL,
                "amount" NUMERIC NOT NULL,
                "project_id" INT REFERENCES "project"("id") ON DELETE CASCADE,
                "created_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "equipment" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "quantity" INT NOT NULL,
                "project_id" INT REFERENCES "project"("id") ON DELETE CASCADE,
                "created_at" TIMESTAMP DEFAULT now()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "equipment";
            DROP TABLE IF EXISTS "penalty";
            DROP TABLE IF EXISTS "budget_history";
            DROP TABLE IF EXISTS "budget";
            DROP TABLE IF EXISTS "client";
            DROP TABLE IF EXISTS "project";
            DROP TABLE IF EXISTS "member";
        `);
    }
}
