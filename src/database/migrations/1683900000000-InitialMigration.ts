import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1683900000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "members" (
                "id" SERIAL PRIMARY KEY,
                "nomeCompleto" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "password" VARCHAR(255) NOT NULL,
                "role" VARCHAR(50) NOT NULL,
                "isActive" BOOLEAN DEFAULT FALSE,
                "skills" TEXT[],
                "gender" VARCHAR(20),
                "phone" VARCHAR(50),
                "photo" VARCHAR(255),
                "resetToken" VARCHAR(255),
                "resetPasswordExpires" TIMESTAMP,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "clients" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "phone" VARCHAR(50),
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "projects" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "description" TEXT,
                "status" VARCHAR(50),
                "startDate" TIMESTAMP,
                "endDate" TIMESTAMP,
                "leaderId" INT,
                "clientId" INT,
                "created_at" TIMESTAMP DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                CONSTRAINT fk_leader FOREIGN KEY ("leaderId") REFERENCES "members"("id"),
                CONSTRAINT fk_client FOREIGN KEY ("clientId") REFERENCES "clients"("id")
            );

            CREATE TABLE "budgets" (
                "id" SERIAL PRIMARY KEY,
                "numeroOrcamento" VARCHAR(100) NOT NULL,
                "descricaoProjeto" TEXT NOT NULL,
                "cliente" VARCHAR(255) NOT NULL,
                "membroResponsavelId" INT NOT NULL,
                "valorEstimado" DECIMAL(10,2) NOT NULL,
                "custosPrevistos" DECIMAL(10,2) NOT NULL,
                "dataCriacao" TIMESTAMP DEFAULT now(),
                "status" VARCHAR(50),
                CONSTRAINT fk_membro_responsavel FOREIGN KEY ("membroResponsavelId") REFERENCES "members"("id")
            );

            CREATE TABLE "budget_history" (
                "id" SERIAL PRIMARY KEY,
                "budgetId" INT REFERENCES "budgets"("id") ON DELETE CASCADE,
                "action" VARCHAR(50) NOT NULL,
                "previousData" JSONB,
                "newData" JSONB,
                "changedById" INT,
                "createdAt" TIMESTAMP DEFAULT now(),
                CONSTRAINT fk_changed_by FOREIGN KEY ("changedById") REFERENCES "members"("id")
            );

            CREATE TABLE "penalties" (
                "id" SERIAL PRIMARY KEY,
                "type" VARCHAR(50) NOT NULL,
                "reason" TEXT NOT NULL,
                "date" DATE NOT NULL,
                "memberId" INT REFERENCES "members"("id"),
                "created_at" TIMESTAMP DEFAULT now()
            );

            CREATE TABLE "equipment" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "description" TEXT,
                "createdAt" TIMESTAMP DEFAULT now(),
                "updatedAt" TIMESTAMP DEFAULT now(),
                "checkedOutById" INT,
                CONSTRAINT fk_checked_out_by FOREIGN KEY ("checkedOutById") REFERENCES "members"("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "equipment";
            DROP TABLE IF EXISTS "penalties";
            DROP TABLE IF EXISTS "budget_history";
            DROP TABLE IF EXISTS "budgets";
            DROP TABLE IF EXISTS "projects";
            DROP TABLE IF EXISTS "clients";
            DROP TABLE IF EXISTS "members";
        `);
    }
}
