import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1683900000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "members" (
                "id" SERIAL PRIMARY KEY,
                "nomeCompleto" VARCHAR(100) NOT NULL,
                "email" VARCHAR(100) UNIQUE NOT NULL,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(50) NOT NULL,
                "isActive" BOOLEAN DEFAULT FALSE,
                "skills" TEXT[],
                "gender" VARCHAR(20),
                "phone" VARCHAR(50),
                "photo" VARCHAR(255),
                "resetToken" VARCHAR(255),
                "resetPasswordToken" VARCHAR(255),
                "resetPasswordExpires" TIMESTAMP,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS "clients" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(100) NOT NULL,
                "email" VARCHAR(100) NOT NULL,
                "phone" VARCHAR(50),
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Garante que a coluna password exista em clients
            ALTER TABLE "clients"
            ADD COLUMN IF NOT EXISTS "password" VARCHAR(255);

            CREATE TABLE IF NOT EXISTS "projects" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(100) NOT NULL,
                "description" TEXT,
                "client_id" INT NOT NULL,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS "budgets" (
                "id" SERIAL PRIMARY KEY,
                "project_id" INT NOT NULL,
                "amount" NUMERIC(15, 2) NOT NULL,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "budgets";
            DROP TABLE IF EXISTS "projects";
            DROP TABLE IF EXISTS "clients";
            DROP TABLE IF EXISTS "members";
        `);
    }
}
