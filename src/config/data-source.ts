// Configuração da conexão com o banco de dados utilizando TypeORM.
// Inclui entidades, migrações e variáveis de ambiente.

import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Member } from "../entities/Member";
import { Project } from "../entities/Project";
import { Client } from "../entities/Client";
import { Budget } from "../entities/Budget";
import { BudgetHistory } from "../entities/BudgetHistory"; // Adicionado
import { Penalty } from "../entities/Penalty";
import { Equipment } from "../entities/Equipment";

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error("Error: Missing required database environment variables.");
    process.exit(1); // Encerra o processo se as variáveis de ambiente estiverem ausentes
}

class Database {
    private static instance: DataSource | null = null;
    private static isInitializing = false;

    static async getInstance(): Promise<DataSource> {
        if (this.instance && this.instance.isInitialized) {
            return this.instance;
        }

        if (this.isInitializing) {
            throw new Error("Database initialization already in progress");
        }

        this.isInitializing = true;
        try {
            this.instance = new DataSource({
                type: "postgres",
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || "5432"),
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.NODE_ENV === "test" 
                    ? "zeus_admin_test" 
                    : process.env.DB_NAME,
                entities: [Member, Project, Client, Budget, BudgetHistory, Penalty, Equipment],
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.NODE_ENV === "development",
                dropSchema: process.env.NODE_ENV === "test",
                poolSize: 10,
                extra: {
                    connectionTimeoutMillis: 5000
                }
            });

            await this.instance.initialize();
            return this.instance;
        } finally {
            this.isInitializing = false;
        }
    }

    static async destroy(): Promise<void> {
        if (this.instance?.isInitialized) {
            await this.instance.destroy();
            this.instance = null;
        }
    }
}

export default Database;
